import jwt from "jsonwebtoken";

export const generateToken = (id: string, role: string): string => {
  return jwt.sign({ _id: id, role }, process.env.JWT_SECRET);
};
