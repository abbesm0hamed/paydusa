import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $migration$
  BEGIN
    -- Development schema push can apply this migration without recording it.
    -- Adopt that state only when ALL of its schema changes are already present.
    IF (
      SELECT array_agg(e.enumlabel::text ORDER BY e.enumsortorder)
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public' AND t.typname = 'enum_users_roles'
    ) = ARRAY['admin', 'public']::text[]
    AND NOT EXISTS (
      SELECT 1
      FROM (VALUES
        ('users', 'name', 'varchar', 'YES'),
        ('users_roles', 'order', 'int4', 'NO'),
        ('users_roles', 'parent_id', 'int4', 'NO'),
        ('users_roles', 'value', 'enum_users_roles', 'YES'),
        ('users_roles', 'id', 'int4', 'NO'),
        ('payload_kv', 'id', 'int4', 'NO'),
        ('payload_kv', 'key', 'varchar', 'NO'),
        ('payload_kv', 'data', 'jsonb', 'NO')
      ) AS expected(table_name, column_name, udt_name, is_nullable)
      LEFT JOIN information_schema.columns actual
        ON actual.table_schema = 'public'
        AND actual.table_name = expected.table_name
        AND actual.column_name = expected.column_name
        AND actual.udt_name = expected.udt_name
        AND actual.is_nullable = expected.is_nullable
      WHERE actual.column_name IS NULL
    )
    AND (CASE WHEN to_regclass('public.users_roles') IS NOT NULL
      THEN pg_get_serial_sequence('public.users_roles', 'id') IS NOT NULL ELSE false END)
    AND (CASE WHEN to_regclass('public.payload_kv') IS NOT NULL
      THEN pg_get_serial_sequence('public.payload_kv', 'id') IS NOT NULL ELSE false END)
    AND NOT EXISTS (
      SELECT 1
      FROM (VALUES
        ('users_roles', 'users_roles_pkey', 'PRIMARY KEY (id)'),
        ('payload_kv', 'payload_kv_pkey', 'PRIMARY KEY (id)'),
        ('users_roles', 'users_roles_parent_fk', 'FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE')
      ) AS expected(table_name, constraint_name, definition)
      WHERE NOT EXISTS (
        SELECT 1 FROM pg_constraint c
        JOIN pg_class t ON t.oid = c.conrelid
        JOIN pg_namespace n ON n.oid = t.relnamespace
        WHERE n.nspname = 'public' AND t.relname = expected.table_name
          AND c.conname = expected.constraint_name AND c.convalidated
          AND pg_get_constraintdef(c.oid) = expected.definition
      )
    )
    AND NOT EXISTS (
      SELECT 1
      FROM (VALUES
        ('users_roles_order_idx', 'CREATE INDEX users_roles_order_idx ON public.users_roles USING btree ("order")'),
        ('users_roles_parent_idx', 'CREATE INDEX users_roles_parent_idx ON public.users_roles USING btree (parent_id)'),
        ('payload_kv_key_idx', 'CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key)')
      ) AS expected(index_name, definition)
      WHERE NOT EXISTS (
        SELECT 1 FROM pg_indexes i
        JOIN pg_class index_table ON index_table.relname = i.indexname
        JOIN pg_namespace n ON n.oid = index_table.relnamespace AND n.nspname = i.schemaname
        JOIN pg_index index_state ON index_state.indexrelid = index_table.oid
        WHERE i.schemaname = 'public' AND i.indexname = expected.index_name
          AND i.indexdef = expected.definition AND index_state.indisvalid
      )
    )
    AND NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conrelid = to_regclass('public.payload_locked_documents_rels')
        AND conname = 'payload_locked_documents_rels_payload_jobs_fk'
    )
    AND to_regclass('public.payload_locked_documents_rels_payload_jobs_id_idx') IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'payload_locked_documents_rels'
        AND column_name = 'payload_jobs_id'
    ) THEN
      RETURN;
    END IF;

    IF to_regtype('public.enum_users_roles') IS NOT NULL
      OR to_regclass('public.users_roles') IS NOT NULL
      OR to_regclass('public.payload_kv') IS NOT NULL
      OR EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'name'
      ) THEN
      RAISE EXCEPTION 'Migration 20260624_195826 found a partially applied or incompatible schema. Back up and reconcile its enum, columns, constraints, indexes, and removed jobs link before retrying.';
    END IF;

   CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'public');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk";
  
  DROP INDEX "payload_locked_documents_rels_payload_jobs_id_idx";
  ALTER TABLE "users" ADD COLUMN "name" varchar;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_jobs_id";
  END
  $migration$;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_kv" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_jobs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");
  ALTER TABLE "users" DROP COLUMN "name";
  DROP TYPE "public"."enum_users_roles";`);
}
