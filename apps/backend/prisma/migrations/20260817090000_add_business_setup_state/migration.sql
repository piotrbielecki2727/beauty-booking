CREATE TYPE "BusinessSpecialization" AS ENUM (
    'NAILS',
    'LASHES',
    'BROWS',
    'MAKEUP',
    'COSMETOLOGY',
    'OTHER'
);

CREATE TYPE "BusinessType" AS ENUM (
    'SOLO',
    'TEAM'
);

CREATE TYPE "BusinessOnboardingStatus" AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETED'
);

CREATE TYPE "BusinessSetupStep" AS ENUM (
    'BUSINESS_BASICS',
    'LOCATION',
    'WORKSTATIONS',
    'SERVICES',
    'ADDONS',
    'TEAM',
    'TEAM_SERVICES',
    'AVAILABILITY',
    'BOOKING_RULES',
    'PUBLIC_PROFILE',
    'SUMMARY'
);

ALTER TABLE "Business"
ADD COLUMN "specialization" "BusinessSpecialization",
ADD COLUMN "businessType" "BusinessType",
ADD COLUMN "onboardingStatus" "BusinessOnboardingStatus" NOT NULL DEFAULT 'NOT_STARTED',
ADD COLUMN "onboardingCurrentStep" "BusinessSetupStep",
ADD COLUMN "onboardingCompletedSteps" "BusinessSetupStep"[] NOT NULL DEFAULT ARRAY[]::"BusinessSetupStep"[],
ADD COLUMN "onboardingCompletedAt" TIMESTAMP(3);

ALTER TABLE "BusinessMembership"
ADD COLUMN "providesServices" BOOLEAN NOT NULL DEFAULT false;
