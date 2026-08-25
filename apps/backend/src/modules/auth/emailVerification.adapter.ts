import { env } from "@/config/env";

type SendVerificationEmailInput = {
  code: string;
  email: string;
  firstName: string;
};

const generateEmailVerificationCode = () => env.AUTH_EMAIL_VERIFICATION_CODE;

const sendVerificationEmail = async ({
  code,
  email,
  firstName,
}: SendVerificationEmailInput) => {
  // TODO backend: replace this mock with the real email provider integration.
  console.info(
    `[mock-email] Verification code for ${firstName} <${email}>: ${code}`,
  );
};

export { generateEmailVerificationCode, sendVerificationEmail };
export type { SendVerificationEmailInput };
