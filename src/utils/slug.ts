import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv'
dotenv.config()

// export const  = (
//   fullName: string,
//   phoneNumber: string
// ): string => {
//   const slug = fullName
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-|-$/g, "");
//   const phoneSuffix = phoneNumber.slice(-4);
//   const randomId = uuidv4().split("-")[0]; // optional but helps uniqueness
//   return `${process.env.BASE_URL}/register/agent/${slug}-${phoneSuffix}-${randomId}`;;
// };

export const generateShareableLink = (
  fullName: string,
  phoneNumber: string
): string => {
  const slug = fullName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const phoneSuffix = phoneNumber.slice(-4);
  const randomId = uuidv4().split("-")[0];
  return `${slug}-${phoneSuffix}-${randomId}`;
};