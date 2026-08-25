CREATE TYPE "BusinessMobileServiceFeeType" AS ENUM (
    'FREE',
    'FIXED',
    'CUSTOM'
);

ALTER TABLE "Business"
ADD COLUMN "mobileServicesEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "mobileServiceMaxDistanceKm" INTEGER,
ADD COLUMN "mobileServiceTravelTimeMinutes" INTEGER,
ADD COLUMN "mobileServiceFeeType" "BusinessMobileServiceFeeType",
ADD COLUMN "mobileServiceFixedFeeAmount" INTEGER;

UPDATE "Business"
SET "mobileServicesEnabled" = true,
    "mobileServiceFeeType" = 'FREE'
WHERE "serviceDeliveryMode" IN ('MOBILE', 'BOTH');

ALTER TABLE "Business"
DROP COLUMN "serviceDeliveryMode";

DROP TYPE "BusinessServiceDeliveryMode";
