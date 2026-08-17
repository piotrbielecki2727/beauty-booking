import bcrypt from "bcryptjs";

const passwordSaltRounds = 12;

const hashPassword = (password: string) =>
  bcrypt.hash(password, passwordSaltRounds);

const verifyPassword = (password: string, passwordHash: string) =>
  bcrypt.compare(password, passwordHash);

export { hashPassword, verifyPassword };
