UPDATE "BusinessBookingSettings"
SET "bookingReleaseMode" = 'MANUAL'
WHERE "bookingReleaseMode" = 'SCHEDULED';

ALTER TABLE "BookingReleaseWindow"
DROP COLUMN "createdDuringOnboarding";

ALTER TABLE "BusinessBookingSettings"
DROP CONSTRAINT "BusinessBookingSettings_bookingHorizonDays_check";

ALTER TYPE "BusinessBookingReleaseMode"
RENAME TO "BusinessBookingReleaseMode_old";

CREATE TYPE "BusinessBookingReleaseMode" AS ENUM (
    'ROLLING',
    'MANUAL'
);

ALTER TABLE "BusinessBookingSettings"
ALTER COLUMN "bookingReleaseMode" TYPE "BusinessBookingReleaseMode"
USING ("bookingReleaseMode"::TEXT::"BusinessBookingReleaseMode");

DROP TYPE "BusinessBookingReleaseMode_old";

ALTER TABLE "BusinessBookingSettings"
ADD CONSTRAINT "BusinessBookingSettings_bookingHorizonDays_check" CHECK (
    (
        "bookingReleaseMode" = 'ROLLING'
        AND "bookingHorizonDays" BETWEEN 1 AND 730
    )
    OR (
        "bookingReleaseMode" = 'MANUAL'
        AND "bookingHorizonDays" IS NULL
    )
);
