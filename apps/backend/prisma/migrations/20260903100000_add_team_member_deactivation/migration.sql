ALTER TABLE "BusinessTeamMember"
ADD COLUMN "deactivatedAt" TIMESTAMP(3);

CREATE INDEX "BusinessTeamMember_businessId_deactivatedAt_idx"
ON "BusinessTeamMember"("businessId", "deactivatedAt");
