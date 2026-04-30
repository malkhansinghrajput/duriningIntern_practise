import bcrypt from "bcrypt";

export const hashItem = async (data) => {
  return bcrypt.hash(data, 10);
};

export const compareItems = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};