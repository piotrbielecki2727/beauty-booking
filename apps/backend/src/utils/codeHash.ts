import { createHash } from "node:crypto";

const hashVerificationCode = (code: string) =>
  createHash("sha256").update(code).digest("hex");

export { hashVerificationCode };
