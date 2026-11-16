import { v2 as cloudinary } from "cloudinary";
import { env } from "./environment.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY.CLOUD_NAME,
  api_key: env.CLOUDINARY.API_KEY,
  api_secret: env.CLOUDINARY.API_SECRET,
  secure: true,
});

export default cloudinary;
