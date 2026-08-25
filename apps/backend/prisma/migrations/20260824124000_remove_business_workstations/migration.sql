UPDATE "Business"
SET "onboardingCurrentStep" = 'AVAILABILITY'
WHERE "onboardingCurrentStep" = 'WORKSTATIONS';

UPDATE "Business"
SET "onboardingCompletedSteps" = array_remove(
    "onboardingCompletedSteps",
    'WORKSTATIONS'::"BusinessSetupStep"
);

ALTER TABLE "Business"
ALTER COLUMN "onboardingCompletedSteps" DROP DEFAULT;

ALTER TYPE "BusinessSetupStep" RENAME TO "BusinessSetupStep_old";

CREATE TYPE "BusinessSetupStep" AS ENUM (
    'BUSINESS_BASICS',
    'LOCATION',
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
ALTER COLUMN "onboardingCurrentStep" TYPE "BusinessSetupStep"
USING "onboardingCurrentStep"::text::"BusinessSetupStep";

ALTER TABLE "Business"
ALTER COLUMN "onboardingCompletedSteps" TYPE "BusinessSetupStep"[]
USING "onboardingCompletedSteps"::text[]::"BusinessSetupStep"[];

ALTER TABLE "Business"
ALTER COLUMN "onboardingCompletedSteps"
SET DEFAULT ARRAY[]::"BusinessSetupStep"[];

DROP TYPE "BusinessSetupStep_old";

DROP TABLE "BusinessWorkstation";

ALTER TABLE "BusinessService"
DROP COLUMN "workstationType";
