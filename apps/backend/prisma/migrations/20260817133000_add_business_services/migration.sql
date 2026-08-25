CREATE TABLE "BusinessService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialization" "BusinessSpecialization" NOT NULL,
    "workstationType" "BusinessSpecialization",
    "durationMinutes" INTEGER NOT NULL,
    "priceAmount" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "BusinessService_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BusinessService_businessId_idx" ON "BusinessService"("businessId");

ALTER TABLE "BusinessService"
ADD CONSTRAINT "BusinessService_businessId_fkey"
FOREIGN KEY ("businessId") REFERENCES "Business"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
