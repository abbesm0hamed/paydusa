# 🛒 Ecommerce Monorepo with Medusa, PayloadCMS, and Next.js

This monorepo integrates a Medusa backend, PayloadCMS, Next.js storefront, Prisma Studio, and an email app for seamless ecommerce development.

# 🔧 Fresh Local Setup

## Prerequisites

1. **Environment Configuration**: Create `.env` files from templates:
   ```bash
   # Root level .env for Docker services
   cp .env.template .env
   
   # Medusa app .env
   cp apps/medusa/.env.template apps/medusa/.env
   ```

2. **Start Docker Services** (PostgreSQL & Redis):
   ```bash
   pnpm docker:up
   ```

3. **Install Dependencies**:
   ```bash
   pnpm install
   ```

4. **Database Setup**:
   ```bash
   cd apps/medusa
   pnpm migrate
   ```

5. **Create Admin User**:
   ```bash
   npx medusa user -e email@gmail.com -p StrongPassword123
   ```

6. **Seed Sample Data**:
   ```bash
   pnpm seed
   ```

7. **Configure Publishable Key**:
   - Start Medusa backend: `pnpm dev`
   - Open Medusa Admin at `backoffice_url/app`
   - Go to Settings → API Key Management
   - Copy the publishable key
   - Add it to storefront `.env`:
     ```
     NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_key_here
     MEDUSA_PUBLISHABLE_KEY=pk_your_key_here
     ```

8. **Setup Storefront** (if using PayloadCMS):
   ```bash
   cd ../storefront
   npx payload migrate
   cd ../..
   ```

9. **Run Prisma Studio** (optional - for database management):
   ```bash
   pnpm studio
   ```

## 🚀 Development Workflow

### Option 1: Run All Apps (Recommended)
```bash
pnpx turbo run dev
```

### Option 2: Individual App Development

1. **Start Services First**:
   ```bash
   # Start Docker containers (PostgreSQL, Redis)
   docker compose up -d
   ```

2. **Start Individual Apps**:
   ```bash
   # Medusa backend
   cd apps/medusa && pnpm dev
   
   # Storefront
   cd apps/storefront && pnpm dev
   
   # Studio
   cd apps/studio && pnpm dev
   ```

3. **Stop Services When Done**:
   ```bash
   docker compose down
   ```

## 🔍 Troubleshooting

- **Database Connection Issues**: Ensure Docker containers are running and environment variables match
- **Port Conflicts**: Check if ports 9000 (Medusa), 3000 (Storefront), 5432 (PostgreSQL), 6379 (Redis) are available
- **Missing Dependencies**: Run `pnpm install` in the root directory

## 📂 Monorepo Structure

- **`storefront`**: Next.js app integrated with Medusa and PayloadCMS.
- **`medusa`**: Medusa backend for ecommerce functionalities.
- **`studio`**: Prisma Studio for database management.
- **`email`**: Email rendering app using `react-email` and `@react-email/components`.

### Email App Features:

- Uses modern React (v19) and Next.js (v15).
- Includes utilities for building, exporting, and type-checking email templates.

## 🌟 Inspiration

- [Next Forge](https://github.com/vercel/next-forge)
- [Medusa Next.js Starter](https://github.com/medusajs/nextjs-starter-medusa.git)
- [PayloadCMS Website template](https://github.com/payloadcms/payload/tree/main/templates/website)
