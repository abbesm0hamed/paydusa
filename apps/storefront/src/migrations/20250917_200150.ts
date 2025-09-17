import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  DROP INDEX "pages_blocks_hover_highlights_highlights_media_media_bottom_idx";
  DROP INDEX "_pages_v_blocks_hover_highlights_highlights_media_media_top_idx";
  DROP INDEX "_pages_v_blocks_hover_highlights_highlights_media_media_bottom_idx";
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "forms_emails_locales" ALTER COLUMN "subject" SET DEFAULT 'You''ve received a new message.';
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hover_highlights_highlights_media_media_bot_idx" ON "pages_blocks_hover_highlights_highlights" USING btree ("media_bottom_id");
  CREATE INDEX "_pages_v_blocks_hover_highlights_highlights_media_media__idx" ON "_pages_v_blocks_hover_highlights_highlights" USING btree ("media_top_id");
  CREATE INDEX "_pages_v_blocks_hover_highlights_highlights_media_medi_1_idx" ON "_pages_v_blocks_hover_highlights_highlights" USING btree ("media_bottom_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_sessions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_sessions" CASCADE;
  DROP INDEX "pages_blocks_hover_highlights_highlights_media_media_bot_idx";
  DROP INDEX "_pages_v_blocks_hover_highlights_highlights_media_media__idx";
  DROP INDEX "_pages_v_blocks_hover_highlights_highlights_media_medi_1_idx";
  DROP INDEX "redirects_from_idx";
  ALTER TABLE "forms_emails_locales" ALTER COLUMN "subject" SET DEFAULT 'You''''ve received a new message.';
  CREATE INDEX "pages_blocks_hover_highlights_highlights_media_media_bottom_idx" ON "pages_blocks_hover_highlights_highlights" USING btree ("media_bottom_id");
  CREATE INDEX "_pages_v_blocks_hover_highlights_highlights_media_media_top_idx" ON "_pages_v_blocks_hover_highlights_highlights" USING btree ("media_top_id");
  CREATE INDEX "_pages_v_blocks_hover_highlights_highlights_media_media_bottom_idx" ON "_pages_v_blocks_hover_highlights_highlights" USING btree ("media_bottom_id");
  CREATE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");`)
}
