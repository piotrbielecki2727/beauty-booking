CREATE TABLE "BusinessDomain" (
    "id" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "BusinessDomain_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Business" ("id", "name", "slug", "createdAt", "updatedAt")
VALUES (
    '00000000-0000-4000-8000-000000000001',
    'Beauty Booking',
    'beauty-booking',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE
SET "name" = EXCLUDED."name",
    "updatedAt" = CURRENT_TIMESTAMP;

ALTER TABLE "User" ADD COLUMN "businessId" TEXT;

UPDATE "User"
SET "businessId" = (
    SELECT "id"
    FROM "Business"
    WHERE "slug" = 'beauty-booking'
)
WHERE "businessId" IS NULL;

ALTER TABLE "User" ALTER COLUMN "businessId" SET NOT NULL;

DROP INDEX IF EXISTS "User_email_key";

CREATE UNIQUE INDEX "User_businessId_email_key" ON "User"("businessId", "email");
CREATE INDEX "User_businessId_idx" ON "User"("businessId");
CREATE UNIQUE INDEX "BusinessDomain_hostname_key" ON "BusinessDomain"("hostname");
CREATE INDEX "BusinessDomain_businessId_idx" ON "BusinessDomain"("businessId");

ALTER TABLE "User" ADD CONSTRAINT "User_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BusinessDomain" ADD CONSTRAINT "BusinessDomain_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
