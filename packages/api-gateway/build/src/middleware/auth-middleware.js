"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const consts_1 = require("../utils/consts");
const logger_1 = require("../utils/logger");
const jsonwebtoken_1 = require("jsonwebtoken");
const server_1 = require("../server");
const api_error_1 = __importDefault(require("../error/api-error"));
function verifyUser(req, _res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const sessionCookie = (_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt;
        const persistentCookie = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.persistent;
        try {
            console.log(sessionCookie, persistentCookie);
            if (!sessionCookie) {
                if (!persistentCookie) {
                    logger_1.logger.error("Token is not available. Gateway Service verifyUser() method error ");
                    throw new api_error_1.default("Please login to access this resource.", consts_1.StatusCode.Unauthorized);
                }
                req.session.jwt = persistentCookie;
            }
            // Use the same token verification logic you're currently using
            yield (0, jsonwebtoken_1.verify)(sessionCookie || persistentCookie, server_1.publicKey, {
                algorithms: ["RS256"],
            });
            // If the token is valid, proceed to the next middleware
            _next();
        }
        catch (error) {
            _next(error);
        }
    });
}
exports.verifyUser = verifyUser;
//# sourceMappingURL=auth-middleware.js.map