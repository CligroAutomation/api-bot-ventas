import { Router } from "express";
import {
  createUser,
  getAuthUser,
  getUserTelefono,
  getUsers,
  updateActivo,
  updatePassword,
  updateThereadId,
  deletedUser,
  deletedUserByTelefono,
  getUser,
  updateUser,
  updateActivoByTelefono,
} from "../controllers/user.controller.js";
import {
  isAdmin,
  isAdminOrAsesor,
  verifyToken,
} from "../middlewares/authJwt.js";

const router = Router();

router.get("/yo", [verifyToken], getAuthUser);
router.post("/", [verifyToken, isAdmin], createUser);
router.get("/", [verifyToken, isAdmin], getUsers);
router.get("/telefono/:telefono", [verifyToken, isAdmin], getUserTelefono);
router.put("/pass/:userId", [verifyToken, isAdmin], updatePassword);
router.put("/isActivo/:userId", [verifyToken, isAdmin], updateActivo);
router.put(
  "/isActivo/:telefono",
  [verifyToken, isAdmin],
  updateActivoByTelefono
);
router.put("/:userId", [verifyToken, isAdmin], updateUser);
router.get("/:userId", [verifyToken, isAdminOrAsesor], getUser);
router.delete("/:userId", [verifyToken, isAdmin], deletedUser);
router.delete("/:telefono", [verifyToken, isAdmin], deletedUserByTelefono);

router.put("/theread/:userId", [verifyToken, isAdmin], updateThereadId);

export default router;
