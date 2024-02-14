import { Router } from "express";
import { PORT } from "../config.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: `API Bot de ventas corriendo en el puerto ${PORT}`,
  });
});

export default router;
