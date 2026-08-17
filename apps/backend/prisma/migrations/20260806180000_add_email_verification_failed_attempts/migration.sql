ALTER TABLE "EmailVerificationCode" ADD COLUMN "failedAttempts" INTEGER NOT NULL DEFAULT 0;
