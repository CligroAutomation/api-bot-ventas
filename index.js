import app from "./src/app.js";
import "./src/database.js";
import { PORT } from "./src/config.js";
import "./src/libs/initialSetup.js";
import http from "http";

const server = http.createServer(app);

server.timeout = 600000; // 10 minutos

server.listen(PORT);
console.log("Server on port", app.get("port"));

export default server;
