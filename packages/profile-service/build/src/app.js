"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./utils/config"));
const routes_1 = require("./routes/v1/routes");
const body_parser_1 = __importDefault(require("body-parser"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
// import swaggerUi from "swagger-ui-express";
// import * as swaggerDocument from "../public/UserSign/swagger.json"
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((req, _res, next) => {
    console.log("***Hello***", req);
    next();
});
app.use((0, hpp_1.default)());
app.use((0, helmet_1.default)());
// const allowedOrigins = [ getConfig().apiGateway, getConfig().authservice];
app.use((0, cors_1.default)({
    origin: (0, config_1.default)().apiGateway,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(body_parser_1.default.json());
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
// app.use("/api-doc",swaggerUi.serve,swaggerUi.setup(swaggerDocument))
(0, routes_1.RegisterRoutes)(app);
app.use(error_handler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map