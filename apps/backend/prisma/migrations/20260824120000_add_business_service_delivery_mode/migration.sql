CREATE TYPE "BusinessServiceDeliveryMode" AS ENUM (
    'SALON',
    'MOBILE',
    'BOTH'
);

ALTER TABLE "Business"
ADD COLUMN "serviceDeliveryMode" "BusinessServiceDeliveryMode" NOT NULL DEFAULT 'SALON';
