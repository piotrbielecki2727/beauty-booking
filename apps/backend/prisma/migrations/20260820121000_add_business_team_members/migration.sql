CREATE TABLE "BusinessTeamMember" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "role" "AccountRole" NOT NULL,
    "providesServices" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "BusinessTeamMember_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BusinessTeamMember_businessId_email_key" ON "BusinessTeamMember"("businessId", "email");
CREATE UNIQUE INDEX "BusinessTeamMember_businessId_userId_key" ON "BusinessTeamMember"("businessId", "userId");
CREATE INDEX "BusinessTeamMember_businessId_idx" ON "BusinessTeamMember"("businessId");
CREATE INDEX "BusinessTeamMember_userId_idx" ON "BusinessTeamMember"("userId");

ALTER TABLE "BusinessTeamMember" ADD CONSTRAINT "BusinessTeamMember_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BusinessTeamMember" ADD CONSTRAINT "BusinessTeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
