CREATE TYPE "BusinessBookingReleaseMode" AS ENUM (
    'ROLLING',
    'MANUAL',
    'SCHEDULED'
);

CREATE TYPE "BusinessBookingConfirmationMode" AS ENUM (
    'AUTOMATIC',
    'MANUAL'
);

ALTER TABLE "Business"
ADD COLUMN "timeZone" TEXT NOT NULL DEFAULT 'Europe/Warsaw';

CREATE TABLE "BusinessBookingSettings" (
    "businessId" TEXT NOT NULL,
    "bookingReleaseMode" "BusinessBookingReleaseMode" NOT NULL,
    "bookingHorizonDays" INTEGER,
    "minimumAdvanceMinutes" INTEGER NOT NULL,
    "cancellationDeadlineHours" INTEGER NOT NULL,
    "inSalonConfirmationMode" "BusinessBookingConfirmationMode" NOT NULL,
    "allowSpecificTeamMember" BOOLEAN NOT NULL DEFAULT true,
    "allowAnyTeamMember" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessBookingSettings_pkey" PRIMARY KEY ("businessId"),
    CONSTRAINT "BusinessBookingSettings_bookingHorizonDays_check" CHECK (
        (
            "bookingReleaseMode" = 'ROLLING'
            AND "bookingHorizonDays" BETWEEN 1 AND 730
        )
        OR (
            "bookingReleaseMode" <> 'ROLLING'
            AND "bookingHorizonDays" IS NULL
        )
    ),
    CONSTRAINT "BusinessBookingSettings_minimumAdvanceMinutes_check" CHECK (
        "minimumAdvanceMinutes" BETWEEN 0 AND 43200
    ),
    CONSTRAINT "BusinessBookingSettings_cancellationDeadlineHours_check" CHECK (
        "cancellationDeadlineHours" BETWEEN 0 AND 720
    )
);

CREATE TABLE "BookingReleaseWindow" (
    "id" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "scheduledPublishDate" DATE,
    "scheduledPublishMinutes" INTEGER,
    "createdDuringOnboarding" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "BookingReleaseWindow_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "BookingReleaseWindow_dateRange_check" CHECK (
        "endDate" >= "startDate"
    ),
    CONSTRAINT "BookingReleaseWindow_scheduledPublication_check" CHECK (
        (
            "scheduledPublishDate" IS NULL
            AND "scheduledPublishMinutes" IS NULL
        )
        OR (
            "scheduledPublishDate" IS NOT NULL
            AND "scheduledPublishMinutes" BETWEEN 0 AND 1439
        )
    )
);

CREATE INDEX "BookingReleaseWindow_businessId_startDate_endDate_idx"
ON "BookingReleaseWindow"("businessId", "startDate", "endDate");

CREATE INDEX "BookingReleaseWindow_scheduledPublishDate_scheduledPublishMinutes_publishedAt_idx"
ON "BookingReleaseWindow"(
    "scheduledPublishDate",
    "scheduledPublishMinutes",
    "publishedAt"
);

ALTER TABLE "BusinessBookingSettings"
ADD CONSTRAINT "BusinessBookingSettings_businessId_fkey"
FOREIGN KEY ("businessId") REFERENCES "Business"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BookingReleaseWindow"
ADD CONSTRAINT "BookingReleaseWindow_businessId_fkey"
FOREIGN KEY ("businessId") REFERENCES "Business"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
