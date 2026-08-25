ALTER TABLE "Business"
ADD COLUMN "specializations" "BusinessSpecialization"[] NOT NULL DEFAULT ARRAY[]::"BusinessSpecialization"[];

UPDATE "Business"
SET "specializations" = ARRAY["specialization"]::"BusinessSpecialization"[]
WHERE "specialization" IS NOT NULL;

ALTER TABLE "Business"
DROP COLUMN "specialization";
