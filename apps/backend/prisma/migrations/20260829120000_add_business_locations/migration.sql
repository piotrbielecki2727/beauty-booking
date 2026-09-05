CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "BusinessLocation" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "street" TEXT,
    "buildingNumber" TEXT NOT NULL,
    "apartmentNumber" TEXT,
    "parkingNote" TEXT,
    "locationNote" TEXT,
    "mobileServicesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mobileServiceMaxDistanceKm" INTEGER,
    "mobileServiceTravelTimeMinutes" INTEGER,
    "mobileServiceFeeType" "BusinessMobileServiceFeeType",
    "mobileServiceFixedFeeAmount" INTEGER,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "BusinessLocation_pkey" PRIMARY KEY ("id")
);

INSERT INTO "BusinessLocation" (
    "id",
    "city",
    "postalCode",
    "street",
    "buildingNumber",
    "apartmentNumber",
    "parkingNote",
    "locationNote",
    "mobileServicesEnabled",
    "mobileServiceMaxDistanceKm",
    "mobileServiceTravelTimeMinutes",
    "mobileServiceFeeType",
    "mobileServiceFixedFeeAmount",
    "sortOrder",
    "createdAt",
    "updatedAt",
    "businessId"
)
SELECT
    gen_random_uuid()::text,
    "city",
    "postalCode",
    "street",
    "buildingNumber",
    "apartmentNumber",
    "parkingNote",
    "locationNote",
    "mobileServicesEnabled",
    "mobileServiceMaxDistanceKm",
    "mobileServiceTravelTimeMinutes",
    "mobileServiceFeeType",
    "mobileServiceFixedFeeAmount",
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    "id"
FROM "Business"
WHERE
    "city" IS NOT NULL
    AND "postalCode" IS NOT NULL
    AND "buildingNumber" IS NOT NULL;

CREATE UNIQUE INDEX "BusinessLocation_businessId_sortOrder_key" ON "BusinessLocation"("businessId", "sortOrder");
CREATE INDEX "BusinessLocation_businessId_idx" ON "BusinessLocation"("businessId");

ALTER TABLE "BusinessLocation" ADD CONSTRAINT "BusinessLocation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Business"
DROP COLUMN "apartmentNumber",
DROP COLUMN "buildingNumber",
DROP COLUMN "city",
DROP COLUMN "locationNote",
DROP COLUMN "mobileServiceFeeType",
DROP COLUMN "mobileServiceFixedFeeAmount",
DROP COLUMN "mobileServiceMaxDistanceKm",
DROP COLUMN "mobileServiceTravelTimeMinutes",
DROP COLUMN "mobileServicesEnabled",
DROP COLUMN "parkingNote",
DROP COLUMN "postalCode",
DROP COLUMN "street";
