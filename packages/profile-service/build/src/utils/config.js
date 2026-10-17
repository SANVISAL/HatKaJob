"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const api_error_1 = __importDefault(require("../error/api-error"));
const path_1 = __importDefault(require("path"));
function Createconfig(configPath) {
    dotenv_1.default.config({ path: configPath });
    const Requirementcofig = ["MONGODB_URL", "LOG_LEVEL", "PORT", "API_GATEWAY", "AUTH_SERVICE"];
    const missingConfig = Requirementcofig.filter((key) => !process.env[key]);
    if (missingConfig.length > 0) {
        throw new api_error_1.default(`Missing required environment variables: ${missingConfig.join(", ")}`);
    }
    return {
        monogourl: process.env.MONGODB_URL,
        logLevel: process.env.LOG_LEVEL,
        port: process.env.PORT,
        apiGateway: process.env.API_GATEWAY,
        authservice: process.env.AUTH_SERVICE
    };
}
const getConfig = (currentEnv = "development") => {
    const configPath = currentEnv === "development"
        ? path_1.default.join(__dirname, `../../configs/.env`)
        : path_1.default.join(__dirname, `../../configs/.env.${currentEnv}`);
    return Createconfig(configPath);
};
exports.default = getConfig;
//# sourceMappingURL=config.js.map