import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

//config
import { PORT } from "./config.js";

// Routes
import indexRoutes from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/user.routes.js";
import categoriasRouter from "./routes/categoria.routes.js";
import itemsRouter from "./routes/item.routes.js";
import ordenRoutes from "./routes/orden.routes.js";
import bloquesRoutes from "./routes/bloque.routes.js";
import reservasRoutes from "./routes/reserva.routes.js";
import botRoutes from "./routes/bot.routes.js";

const app = express();
app.use(cookieParser());

// Settings
app.set("port", PORT || 6009);
app.set("json spaces", 4);

// Middlewares
const corsOptions = {
  origin: ["http://localhost:4000", "http://localhost:5173"],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization, X-Requested-With",
};

app.use(cors(corsOptions));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

// Routes
app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/categorias", categoriasRouter);
app.use("/api/items", itemsRouter);
app.use("/api/ordenes", ordenRoutes);
app.use("/api/bloques", bloquesRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/bot", botRoutes);

export default app;
