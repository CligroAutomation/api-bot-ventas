import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";

import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../config.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(
  folder,
  nombre,
  image,
  format = "webp",
  crop = "fill",
  width = 800,
  height = 800
) {
  // Obtén la ruta del directorio del módulo actual
  const currentModuleFile = fileURLToPath(import.meta.url);
  const moduleDir = path.dirname(currentModuleFile);

  const pathImage = path.join(
    moduleDir,
    `../../uploads/${image.tempFilePath.split("\\")[1]}`
  );

  return await cloudinary.uploader.upload(pathImage, {
    folder: `${folder}/${nombre}`,
    format,
    crop,
    width,
    height,
  });
}

export async function deleteImage(public_id) {
  return await cloudinary.uploader.destroy(public_id);
}
