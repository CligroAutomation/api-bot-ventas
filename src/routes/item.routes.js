import { Router } from "express";

import {
  createItem,
  getItems,
  getItem,
  updateItem,
  deletedItem,
  getItemsByCategoria,
  getItemsByUser,
  toggleItem,
  getItemsByTipo,
} from "../controllers/item.controller.js";

import {
  isAdmin,
  verifyToken,
  isAdminOrAsesor,
} from "../middlewares/authJwt.js";

const router = Router();

router.post("/", [verifyToken, isAdminOrAsesor], createItem);
router.get("/", getItems);
router.get("/:itemId", getItem);
router.put("/:itemId", [verifyToken, isAdminOrAsesor], updateItem);
router.delete("/:itemId", [verifyToken, isAdminOrAsesor], deletedItem);
router.get("/categoria/:categoriaId", getItemsByCategoria);
router.get("/user/:userId", getItemsByUser);
router.put("/toggle/:itemId", [verifyToken, isAdminOrAsesor], toggleItem);
router.get("/tipo/:tipo", getItemsByTipo);

export default router;
