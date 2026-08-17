ALTER TABLE "User" ADD COLUMN "termsAndPrivacyPolicyAcceptedAt" TIMESTAMP(3);

UPDATE "User"
SET "termsAndPrivacyPolicyAcceptedAt" = COALESCE(
    "termsAcceptedAt",
    "privacyPolicyAcceptedAt"
)
WHERE "termsAndPrivacyPolicyAcceptedAt" IS NULL;

ALTER TABLE "User" DROP COLUMN "termsAcceptedAt";
ALTER TABLE "User" DROP COLUMN "privacyPolicyAcceptedAt";
