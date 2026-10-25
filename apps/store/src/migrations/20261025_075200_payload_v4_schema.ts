import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_payload_jobs_log_parent_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_llm_instructions_entity_type" AS ENUM('collection', 'global');
  CREATE TABLE "payload_llm_instructions" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_slug" varchar NOT NULL,
  	"entity_type" "enum_payload_llm_instructions_entity_type" NOT NULL,
  	"additional_instructions" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_llm_instructions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_jobs_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DROP INDEX "pages__status_idx";
  DROP INDEX "pages_locales_locale_parent_id_unique";
  DROP INDEX "_pages_v_version_version__status_idx";
  DROP INDEX "_pages_v_snapshot_idx";
  DROP INDEX "_pages_v_locales_locale_parent_id_unique";
  DROP INDEX "posts__status_idx";
  DROP INDEX "posts_locales_locale_parent_id_unique";
  DROP INDEX "_posts_v_version_version__status_idx";
  DROP INDEX "_posts_v_snapshot_idx";
  DROP INDEX "_posts_v_locales_locale_parent_id_unique";
  DROP INDEX "categories_locales_locale_parent_id_unique";
  DROP INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique";
  DROP INDEX "forms_blocks_country_locales_locale_parent_id_unique";
  DROP INDEX "forms_blocks_email_locales_locale_parent_id_unique";
  DROP INDEX "forms_blocks_message_locales_locale_parent_id_unique";
  DROP INDEX "forms_blocks_number_locales_locale_parent_id_unique";
  DROP INDEX "forms_blocks_select_options_locales_locale_parent_id_unique";
  DROP INDEX "forms_blocks_select_locales_locale_parent_id_unique";
  DROP INDEX "forms_blocks_state_locales_locale_parent_id_unique";
  DROP INDEX "forms_blocks_text_locales_locale_parent_id_unique";
  DROP INDEX "forms_blocks_textarea_locales_locale_parent_id_unique";
  DROP INDEX "forms_emails_locales_locale_parent_id_unique";
  DROP INDEX "forms_locales_locale_parent_id_unique";
  DROP INDEX "search_locales_locale_parent_id_unique";
  DROP INDEX "payload_jobs_processing_idx";
  DROP INDEX "footer_columns_locales_locale_parent_id_unique";
  UPDATE "payload_jobs_log" SET "input" = '{}'::jsonb WHERE "input" IS NULL;
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "input" SET NOT NULL;
  ALTER TABLE "pages_locales" ADD COLUMN "_status" "enum_pages_status" DEFAULT 'draft';
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version__status" "enum__pages_v_version_status" DEFAULT 'draft';
  ALTER TABLE "posts_locales" ADD COLUMN "_status" "enum_posts_status" DEFAULT 'draft';
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version__status" "enum__posts_v_version_status" DEFAULT 'draft';
  -- Preserve the old shared publish status in every existing locale.
  UPDATE "pages_locales" AS localized SET "_status" = parent."_status"
    FROM "pages" AS parent WHERE localized."_parent_id" = parent."id";
  UPDATE "_pages_v_locales" AS localized SET "version__status" = parent."version__status"
    FROM "_pages_v" AS parent WHERE localized."_parent_id" = parent."id";
  UPDATE "posts_locales" AS localized SET "_status" = parent."_status"
    FROM "posts" AS parent WHERE localized."_parent_id" = parent."id";
  UPDATE "_posts_v_locales" AS localized SET "version__status" = parent."version__status"
    FROM "_posts_v" AS parent WHERE localized."_parent_id" = parent."id";
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN "original_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "original_url" varchar;
  ALTER TABLE "media" ADD COLUMN "original_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "original_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "original_width" numeric;
  ALTER TABLE "media" ADD COLUMN "original_height" numeric;
  ALTER TABLE "media" ADD COLUMN "original_prefix" varchar;
  ALTER TABLE "media" ADD COLUMN "original__objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN "variants_thumbnail_prefix" varchar;
  ALTER TABLE "media" ADD COLUMN "variants_thumbnail__objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN "variants_card_prefix" varchar;
  ALTER TABLE "media" ADD COLUMN "variants_card__objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN "variants_tablet_prefix" varchar;
  ALTER TABLE "media" ADD COLUMN "variants_tablet__objectkey" varchar;
  ALTER TABLE "users" ADD COLUMN "api_key_last4" varchar;
  ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;
  ALTER TABLE "payload_jobs_log" ADD COLUMN "parent_task_slug" "enum_payload_jobs_log_parent_task_slug";
  ALTER TABLE "payload_jobs_log" ADD COLUMN "parent_task_i_d" varchar;
  ALTER TABLE "payload_jobs" ADD COLUMN "meta" jsonb;
  ALTER TABLE "payload_jobs" ADD COLUMN "processing_until" timestamp(3) with time zone;
  ALTER TABLE "payload_jobs" ADD COLUMN "processing_token" varchar;
  ALTER TABLE "payload_jobs" ADD COLUMN "concurrency_key" varchar;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_llm_instructions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_llm_instructions_entity_slug_idx" ON "payload_llm_instructions" USING btree ("entity_slug");
  CREATE INDEX "payload_llm_instructions_updated_at_idx" ON "payload_llm_instructions" USING btree ("updated_at");
  CREATE INDEX "payload_llm_instructions_created_at_idx" ON "payload_llm_instructions" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_rels_order_idx" ON "payload_llm_instructions_rels" USING btree ("order");
  CREATE INDEX "payload_llm_instructions_rels_parent_idx" ON "payload_llm_instructions_rels" USING btree ("parent_id");
  CREATE INDEX "payload_llm_instructions_rels_path_idx" ON "payload_llm_instructions_rels" USING btree ("path");
  CREATE INDEX "payload_llm_instructions_rels_users_id_idx" ON "payload_llm_instructions_rels" USING btree ("users_id");
  CREATE INDEX "pages__status_idx" ON "pages_locales" USING btree ("_status","_locale");
  CREATE UNIQUE INDEX "pages_locales_parent_id_locale_unique" ON "pages_locales" USING btree ("_parent_id","_locale");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v_locales" USING btree ("version__status","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_parent_id_locale_unique" ON "_pages_v_locales" USING btree ("_parent_id","_locale");
  CREATE INDEX "posts__status_idx" ON "posts_locales" USING btree ("_status","_locale");
  CREATE UNIQUE INDEX "posts_locales_parent_id_locale_unique" ON "posts_locales" USING btree ("_parent_id","_locale");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v_locales" USING btree ("version__status","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_parent_id_locale_unique" ON "_posts_v_locales" USING btree ("_parent_id","_locale");
  CREATE INDEX "media_original_original_filename_idx" ON "media" USING btree ("original_filename");
  CREATE UNIQUE INDEX "categories_locales_parent_id_locale_unique" ON "categories_locales" USING btree ("_parent_id","_locale");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_parent_id_locale_unique" ON "forms_blocks_checkbox_locales" USING btree ("_parent_id","_locale");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_parent_id_locale_unique" ON "forms_blocks_country_locales" USING btree ("_parent_id","_locale");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_parent_id_locale_unique" ON "forms_blocks_email_locales" USING btree ("_parent_id","_locale");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_parent_id_locale_unique" ON "forms_blocks_message_locales" USING btree ("_parent_id","_locale");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_parent_id_locale_unique" ON "forms_blocks_number_locales" USING btree ("_parent_id","_locale");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_parent_id_locale_unique" ON "forms_blocks_select_options_locales" USING btree ("_parent_id","_locale");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_parent_id_locale_unique" ON "forms_blocks_select_locales" USING btree ("_parent_id","_locale");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_parent_id_locale_unique" ON "forms_blocks_state_locales" USING btree ("_parent_id","_locale");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_parent_id_locale_unique" ON "forms_blocks_text_locales" USING btree ("_parent_id","_locale");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_parent_id_locale_unique" ON "forms_blocks_textarea_locales" USING btree ("_parent_id","_locale");
  CREATE UNIQUE INDEX "forms_emails_locales_parent_id_locale_unique" ON "forms_emails_locales" USING btree ("_parent_id","_locale");
  CREATE UNIQUE INDEX "forms_locales_parent_id_locale_unique" ON "forms_locales" USING btree ("_parent_id","_locale");
  CREATE UNIQUE INDEX "search_locales_parent_id_locale_unique" ON "search_locales" USING btree ("_parent_id","_locale");
  CREATE INDEX "payload_jobs_processing_until_idx" ON "payload_jobs" USING btree ("processing_until");
  CREATE INDEX "payload_jobs_concurrency_key_idx" ON "payload_jobs" USING btree ("concurrency_key");
  CREATE UNIQUE INDEX "footer_columns_locales_parent_id_locale_unique" ON "footer_columns_locales" USING btree ("_parent_id","_locale");
  ALTER TABLE "pages" DROP COLUMN "_status";
  ALTER TABLE "_pages_v" DROP COLUMN "version__status";
  ALTER TABLE "_pages_v" DROP COLUMN "snapshot";
  ALTER TABLE "posts" DROP COLUMN "_status";
  ALTER TABLE "_posts_v" DROP COLUMN "version__status";
  ALTER TABLE "_posts_v" DROP COLUMN "snapshot";
  -- V4 revokes keys by clearing them, not by an enable flag. Never reactivate a disabled key.
  UPDATE "users" SET "api_key" = NULL, "api_key_index" = NULL
    WHERE "enable_a_p_i_key" IS NOT TRUE;
  ALTER TABLE "users" DROP COLUMN "enable_a_p_i_key";
  ALTER TABLE "payload_jobs" DROP COLUMN "processing";`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_llm_instructions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_llm_instructions_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_stats" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_llm_instructions" CASCADE;
  DROP TABLE "payload_llm_instructions_rels" CASCADE;
  DROP TABLE "payload_jobs_stats" CASCADE;
  DROP INDEX "pages__status_idx";
  DROP INDEX "pages_locales_parent_id_locale_unique";
  DROP INDEX "_pages_v_version_version__status_idx";
  DROP INDEX "_pages_v_locales_parent_id_locale_unique";
  DROP INDEX "posts__status_idx";
  DROP INDEX "posts_locales_parent_id_locale_unique";
  DROP INDEX "_posts_v_version_version__status_idx";
  DROP INDEX "_posts_v_locales_parent_id_locale_unique";
  DROP INDEX "media_original_original_filename_idx";
  DROP INDEX "categories_locales_parent_id_locale_unique";
  DROP INDEX "forms_blocks_checkbox_locales_parent_id_locale_unique";
  DROP INDEX "forms_blocks_country_locales_parent_id_locale_unique";
  DROP INDEX "forms_blocks_email_locales_parent_id_locale_unique";
  DROP INDEX "forms_blocks_message_locales_parent_id_locale_unique";
  DROP INDEX "forms_blocks_number_locales_parent_id_locale_unique";
  DROP INDEX "forms_blocks_select_options_locales_parent_id_locale_unique";
  DROP INDEX "forms_blocks_select_locales_parent_id_locale_unique";
  DROP INDEX "forms_blocks_state_locales_parent_id_locale_unique";
  DROP INDEX "forms_blocks_text_locales_parent_id_locale_unique";
  DROP INDEX "forms_blocks_textarea_locales_parent_id_locale_unique";
  DROP INDEX "forms_emails_locales_parent_id_locale_unique";
  DROP INDEX "forms_locales_parent_id_locale_unique";
  DROP INDEX "search_locales_parent_id_locale_unique";
  DROP INDEX "payload_jobs_processing_until_idx";
  DROP INDEX "payload_jobs_concurrency_key_idx";
  DROP INDEX "footer_columns_locales_parent_id_locale_unique";
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "input" DROP NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "_status" "enum_pages_status" DEFAULT 'draft';
  ALTER TABLE "_pages_v" ADD COLUMN "version__status" "enum__pages_v_version_status" DEFAULT 'draft';
  ALTER TABLE "_pages_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "posts" ADD COLUMN "_status" "enum_posts_status" DEFAULT 'draft';
  ALTER TABLE "_posts_v" ADD COLUMN "version__status" "enum__posts_v_version_status" DEFAULT 'draft';
  ALTER TABLE "_posts_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "users" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "payload_jobs" ADD COLUMN "processing" boolean DEFAULT false;
  -- V3 has one shared status: restore the configured default locale (en).
  UPDATE "pages" AS parent SET "_status" = localized."_status"
    FROM "pages_locales" AS localized WHERE localized."_parent_id" = parent."id" AND localized."_locale" = 'en';
  UPDATE "_pages_v" AS parent SET "version__status" = localized."version__status"
    FROM "_pages_v_locales" AS localized WHERE localized."_parent_id" = parent."id" AND localized."_locale" = 'en';
  UPDATE "posts" AS parent SET "_status" = localized."_status"
    FROM "posts_locales" AS localized WHERE localized."_parent_id" = parent."id" AND localized."_locale" = 'en';
  UPDATE "_posts_v" AS parent SET "version__status" = localized."version__status"
    FROM "_posts_v_locales" AS localized WHERE localized."_parent_id" = parent."id" AND localized."_locale" = 'en';
  UPDATE "users" SET "enable_a_p_i_key" = ("api_key_index" IS NOT NULL);
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "footer_columns_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "pages_locales" DROP COLUMN "_status";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version__status";
  ALTER TABLE "posts_locales" DROP COLUMN "_status";
  ALTER TABLE "_posts_v_locales" DROP COLUMN "version__status";
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  ALTER TABLE "media" DROP COLUMN "original_filename";
  ALTER TABLE "media" DROP COLUMN "original_url";
  ALTER TABLE "media" DROP COLUMN "original_mime_type";
  ALTER TABLE "media" DROP COLUMN "original_filesize";
  ALTER TABLE "media" DROP COLUMN "original_width";
  ALTER TABLE "media" DROP COLUMN "original_height";
  ALTER TABLE "media" DROP COLUMN "original_prefix";
  ALTER TABLE "media" DROP COLUMN "original__objectkey";
  ALTER TABLE "media" DROP COLUMN "variants_thumbnail_prefix";
  ALTER TABLE "media" DROP COLUMN "variants_thumbnail__objectkey";
  ALTER TABLE "media" DROP COLUMN "variants_card_prefix";
  ALTER TABLE "media" DROP COLUMN "variants_card__objectkey";
  ALTER TABLE "media" DROP COLUMN "variants_tablet_prefix";
  ALTER TABLE "media" DROP COLUMN "variants_tablet__objectkey";
  ALTER TABLE "users" DROP COLUMN "api_key_last4";
  ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";
  ALTER TABLE "payload_jobs_log" DROP COLUMN "parent_task_slug";
  ALTER TABLE "payload_jobs_log" DROP COLUMN "parent_task_i_d";
  ALTER TABLE "payload_jobs" DROP COLUMN "meta";
  ALTER TABLE "payload_jobs" DROP COLUMN "processing_until";
  ALTER TABLE "payload_jobs" DROP COLUMN "processing_token";
  ALTER TABLE "payload_jobs" DROP COLUMN "concurrency_key";
  DROP TYPE "public"."enum_payload_jobs_log_parent_task_slug";
  DROP TYPE "public"."enum_payload_llm_instructions_entity_type";`);
}
