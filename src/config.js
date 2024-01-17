import { config } from "dotenv";
config();

export const MONGODB_URI = process.env.MONGODB_URI;

export const PORT = process.env.PORT || 6009;
export const SECRET = process.env.SECRET;

export const ADMIN_NOMBRE = process.env.ADMIN_NOMBRE;
export const ADMIN_APELLIDO = process.env.ADMIN_APELLIDO;
export const ADMIN_TELEFONO = process.env.ADMIN_TELEFONO;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
