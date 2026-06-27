# Database Management Package

This package manages the shared PostgreSQL instance and provides tools for database management and visualization.

## Services

- **PostgreSQL**: The core database server (Port 5555)
- **pgAdmin**: Universal DB management UI (Port 5050)
  - **Email**: `admin@ecommerce.com`
  - **Password**: `admin`
  - **Auto-connected Server**: `Ecommerce Monorepo` (User: `ecommerce_admin`)
- **Redis**: In-memory cache and job queue (Port 6379)

## Database

A single PostgreSQL instance hosts two databases:

| Database           | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `ecommerce_medusa` | Medusa commerce engine                               |
| `ecommerce_cms`    | Payload CMS content (embedded in the storefront app) |

## Database Setup

To scaffold the databases with schemas and initial data:

```bash
node --run db:setup
```

This runs:

1. Medusa migrations & seeding (`ecommerce_medusa`)
2. Payload CMS migrations (`ecommerce_cms`)

## Visualization Tools

### pgAdmin

Available at [http://localhost:5050](http://localhost:5050).
The server is **automatically registered** in the sidebar. You just need to:

1. Double-click **Ecommerce Monorepo** in the sidebar.
2. Enter the DB password: `password`
