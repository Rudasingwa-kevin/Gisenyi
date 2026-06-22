-- AlterTable
ALTER TABLE "Place" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "featuredTag" TEXT;
