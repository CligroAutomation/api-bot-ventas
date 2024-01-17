import { Router } from "express";
import {
  signinHandler,
  signoutHandler,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post("/signin", signinHandler);
router.get("/signout", [verifyToken], signoutHandler);

//signout

export default router;
