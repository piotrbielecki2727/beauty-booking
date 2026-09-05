ALTER TABLE "BusinessTeamMember"
ADD COLUMN "phoneNumber" TEXT,
ADD COLUMN "birthdayMonth" INTEGER,
ADD COLUMN "birthdayDay" INTEGER;

ALTER TABLE "BusinessTeamMember"
ADD CONSTRAINT "BusinessTeamMember_birthday_complete_check"
CHECK (
  ("birthdayMonth" IS NULL AND "birthdayDay" IS NULL)
  OR ("birthdayMonth" IS NOT NULL AND "birthdayDay" IS NOT NULL)
);

ALTER TABLE "BusinessTeamMember"
ADD CONSTRAINT "BusinessTeamMember_birthday_range_check"
CHECK (
  "birthdayMonth" IS NULL
  OR (
    "birthdayMonth" BETWEEN 1 AND 12
    AND "birthdayDay" BETWEEN 1 AND CASE
      WHEN "birthdayMonth" IN (1, 3, 5, 7, 8, 10, 12) THEN 31
      WHEN "birthdayMonth" IN (4, 6, 9, 11) THEN 30
      ELSE 29
    END
  )
);

ALTER TABLE "BusinessTeamInvitation"
ADD COLUMN "token" TEXT;

CREATE UNIQUE INDEX "BusinessTeamInvitation_token_key" ON "BusinessTeamInvitation"("token");
