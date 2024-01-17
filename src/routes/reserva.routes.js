import { Router } from "express";
import {
  createReserva,
  getReserva,
  getReservas,
  updateReserva,
  deleteReserva,
  getReservasByEstado,
  getReservasByUser,
  getMyReservas,
  getMyReserva,
} from "../controllers/reserva.controller.js";

import {
  isAdmin,
  verifyToken,
  isAdminOrAsesor,
} from "../middlewares/authJwt.js";

const router = Router();

router.post("/", [verifyToken], createReserva);
router.get("/", [verifyToken, isAdminOrAsesor], getReservas);
router.get("/:reservaId", [verifyToken, isAdminOrAsesor], getReserva);
router.put("/:reservaId", [verifyToken, isAdminOrAsesor], updateReserva);
router.delete("/:reservaId", [verifyToken, isAdminOrAsesor], deleteReserva);
router.get(
  "/estado/:estado",
  [verifyToken, isAdminOrAsesor],
  getReservasByEstado
);

router.get("/user/:userId", [verifyToken, isAdminOrAsesor], getReservasByUser);

router.get("/my", [verifyToken], getMyReservas);

router.get("/my/:reservaId", [verifyToken], getMyReserva);

export default router;
