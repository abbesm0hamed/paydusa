#!/bin/bash
set -e

    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
        SELECT 'CREATE DATABASE ecommerce_cms' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecommerce_cms')\gexec
        SELECT 'CREATE DATABASE ecommerce_medusa' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecommerce_medusa')\gexec
    EOSQL
