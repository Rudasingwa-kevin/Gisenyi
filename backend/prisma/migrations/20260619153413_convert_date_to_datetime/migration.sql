-- AlterTable: Add temporary DateTime columns
ALTER TABLE "CalendarItem" ADD COLUMN "date_new" TIMESTAMP(3);
ALTER TABLE "Event" ADD COLUMN "date_new" TIMESTAMP(3);

-- Convert CalendarItem dates (already ISO-8601 "YYYY-MM-DD")
UPDATE "CalendarItem" SET "date_new" = "date"::timestamp;

-- Convert Event dates (human-readable "Month DD, YYYY")
-- PostgreSQL can parse these with TO_TIMESTAMP
UPDATE "Event" SET "date_new" = CASE
  WHEN "date" ~ '^\d{4}-\d{2}-\d{2}' THEN "date"::timestamp
  ELSE to_timestamp("date", 'FMMonth DD, YYYY')
END;

-- Drop old columns
ALTER TABLE "CalendarItem" DROP COLUMN "date";
ALTER TABLE "Event" DROP COLUMN "date";

-- Rename new columns
ALTER TABLE "CalendarItem" RENAME COLUMN "date_new" TO "date";
ALTER TABLE "Event" RENAME COLUMN "date_new" TO "date";

-- Make columns NOT NULL
ALTER TABLE "CalendarItem" ALTER COLUMN "date" SET NOT NULL;
ALTER TABLE "Event" ALTER COLUMN "date" SET NOT NULL;

-- Recreate index
CREATE INDEX "CalendarItem_date_idx" ON "CalendarItem"("date");
