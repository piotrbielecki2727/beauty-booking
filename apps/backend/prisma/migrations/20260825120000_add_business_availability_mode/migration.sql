CREATE TYPE "BusinessAvailabilityMode" AS ENUM (
    'FIXED_HOURS',
    'INDIVIDUAL_SCHEDULES'
);

ALTER TABLE "Business"
ADD COLUMN "availabilityMode" "BusinessAvailabilityMode";

UPDATE "Business"
SET "availabilityMode" = 'FIXED_HOURS';
