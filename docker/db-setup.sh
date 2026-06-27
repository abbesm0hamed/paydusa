#!/bin/bash
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Starting Master Database Setup...${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

CONTAINER_NAME="ecommerce-postgres"
POSTGRES_USER="ecommerce_admin"

psql_exec() {
  docker exec -i "$CONTAINER_NAME" psql -U "$POSTGRES_USER" "$@"
}

echo -e "${YELLOW}Checking PostgreSQL connection...${NC}"
if ! docker exec "$CONTAINER_NAME" pg_isready -U "$POSTGRES_USER" >/dev/null 2>&1; then
  echo -e "${RED}Docker container '$CONTAINER_NAME' is not running.${NC}"
  echo -e "${YELLOW}Run 'node --run db:start' first.${NC}"
  exit 1
fi
echo -e "${GREEN}PostgreSQL is running.${NC}"

create_db_if_not_exists() {
  local db_name="$1"
  local exists
  exists=$(psql_exec -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$db_name'")
  if [ "$exists" != "1" ]; then
    echo -e "${YELLOW}Database '$db_name' not found. Creating...${NC}"
    psql_exec -d postgres -c "CREATE DATABASE $db_name"
    echo -e "${GREEN}Database '$db_name' created.${NC}"
  else
    echo -e "${GREEN}Database '$db_name' already exists.${NC}"
  fi
}

create_db_if_not_exists "ecommerce_medusa"
create_db_if_not_exists "ecommerce_cms"

echo ""
echo -e "${BLUE}Setting up Medusa (ecommerce_medusa)...${NC}"
cd "$ROOT_DIR/apps/medusa"
npx medusa db:migrate
node --run seed || echo -e "${YELLOW}Medusa seeding skipped or already completed.${NC}"
npx medusa user -e admin@medusajs.com -p "$MEDUSA_ADMIN_PASSWORD" || echo -e "${YELLOW}Medusa admin user might already exist.${NC}"

echo ""
echo -e "${BLUE}Setting up CMS (ecommerce_cms)...${NC}"
cd "$ROOT_DIR/apps/store"
yes | npx --yes payload migrate

echo ""
echo -e "${GREEN}Database setup complete! Both Medusa and CMS databases are ready.${NC}"
echo -e "${YELLOW}Start all apps with: node --run dev${NC}"
