CREATE TYPE "BusinessWeekday" AS ENUM (
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
);

CREATE TABLE "BusinessOpeningHour" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "BusinessWeekday" NOT NULL,
    "isOpen" BOOLEAN NOT NULL,
    "opensAtMinutes" INTEGER,
    "closesAtMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "BusinessOpeningHour_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BusinessOpeningHour_businessId_dayOfWeek_key"
ON "BusinessOpeningHour"("businessId", "dayOfWeek");

CREATE INDEX "BusinessOpeningHour_businessId_idx"
ON "BusinessOpeningHour"("businessId");

ALTER TABLE "BusinessOpeningHour"
ADD CONSTRAINT "BusinessOpeningHour_businessId_fkey"
FOREIGN KEY ("businessId") REFERENCES "Business"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
