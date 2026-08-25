ALTER TABLE "BusinessMembership"
ALTER COLUMN "providesServices" DROP NOT NULL,
ALTER COLUMN "providesServices" DROP DEFAULT;

UPDATE "BusinessMembership" AS membership
SET "providesServices" = CASE
  WHEN business."businessType" = 'SOLO' THEN true
  ELSE NULL
END
FROM "Business" AS business
WHERE membership."businessId" = business.id
  AND membership.role = 'Owner'
  AND business."businessType" IS NOT NULL;
