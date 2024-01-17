import { Router } from "express";

import {
  createCategoria,
  getCategorias,
  getCategoria,
  updateCategoria,
  deletedCategoria,
} from "../controllers/categoria.controller.js";

import { verifyToken, isAdminOrAsesor } from "../middlewares/authJwt.js";

const router = Router();

router.post("/", [verifyToken, isAdminOrAsesor], createCategoria);
router.get("/", getCategorias);
router.get("/:categoriaId", getCategoria);
router.put("/:categoriaId", [verifyToken, isAdminOrAsesor], updateCategoria);
router.delete(
  "/:categoriaId",
  [verifyToken, isAdminOrAsesor],
  deletedCategoria
);

export default router;
