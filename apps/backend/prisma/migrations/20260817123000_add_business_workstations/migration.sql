CREATE TABLE "BusinessWorkstation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "BusinessSpecialization" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "BusinessWorkstation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BusinessWorkstation_businessId_idx" ON "BusinessWorkstation"("businessId");

ALTER TABLE "BusinessWorkstation"
ADD CONSTRAINT "BusinessWorkstation_businessId_fkey"
FOREIGN KEY ("businessId") REFERENCES "Business"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
