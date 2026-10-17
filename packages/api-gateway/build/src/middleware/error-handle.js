"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const base_custom_error_1 = __importDefault(require("../error/base-custom-error"));
const status_code_1 = require("../utils/consts/status-code");
const logger_1 = require("../utils/logger");
const errorHandler = (err, _req, res, _next) => {
    logger_1.logger.error(`Gateway Service`, err);
    // If the error is an instance of our own throw ERROR
    if (err instanceof base_custom_error_1.default) {
        return res.status(err.getStatusCode()).json(err.serializeErrorOutput());
    }
    return res
        .status(status_code_1.StatusCode.InternalServerError)
        .json({ errors: [{ message: "An unexpected error occurred" }] });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handle.js.map