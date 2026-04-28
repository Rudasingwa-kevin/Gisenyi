-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "osmId" TEXT,
    "name" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "catKey" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 4.5,
    "tags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Place_osmId_key" ON "Place"("osmId");

-- CreateIndex
CREATE INDEX "Place_catKey_idx" ON "Place"("catKey");
