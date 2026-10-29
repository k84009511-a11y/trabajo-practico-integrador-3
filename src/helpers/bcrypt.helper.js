import bycrypt from "bcrypt";

export const hashPassword = async (password) => {
  return await bycrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
  return await bycrypt.compare(password, hash);
};
