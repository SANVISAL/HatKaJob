import express from "express";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import getConfig from "./utils/config";
import { RegisterRoutes } from "./routes/v1/routes";
import bodyParser from "body-parser";
import errorHandler from "./middleware/error-handler";
// import swaggerUi from "swagger-ui-express";
// import * as swaggerDocument from "../public/UserSign/swagger.json"
const app = express();
app.set("trust proxy", 1);
app.use((req, _res, next) => {
  console.log("***Hello***", req);
  next();
});
app.use(hpp());
app.use(helmet());
// const allowedOrigins = [ getConfig().apiGateway, getConfig().authservice];
app.use(
  cors({
    origin: getConfig().apiGateway,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());
// app.use("/api-doc",swaggerUi.serve,swaggerUi.setup(swaggerDocument))

RegisterRoutes(app);
app.use(errorHandler);

export default app;
