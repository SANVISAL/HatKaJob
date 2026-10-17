"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_proxy_middleware_1 = require("http-proxy-middleware");
const routes_def_1 = require("../routes-def");
const logger_1 = require("../utils/logger");
const createCofig_1 = __importDefault(require("../utils/createCofig"));
const consts_1 = require("../utils/consts");
const cookieOption_1 = require("../utils/cookieOption");
const config = (0, createCofig_1.default)();
// Define the proxy rules and targets
const proxyConfigs = {
    /// implemet auth service
    [routes_def_1.ROUTE_PATHS.AUTH_SERVICE]: {
        target: config.authServiceUrl,
        changeOrigin: true,
        selfHandleResponse: true,
        pathRewrite: (path, _req) => {
            return `${routes_def_1.ROUTE_PATHS.AUTH_SERVICE}${path}`;
        },
        on: {
            proxyReq: (proxyReq, req, _res) => {
                const expressReq = req;
                // Log the request payload
                expressReq.on("data", (chunk) => {
                    logger_1.logger.info(`Request Body Chunk: ${chunk}`);
                });
                // Extract JWT token from session
                const token = expressReq.session.jwt;
                proxyReq.setHeader("Authorization", `Bearer ${token}`);
                if (token) {
                    // proxyReq.setHeader("Authorization", `Bearer ${token}`);
                    logger_1.logger.info(`JWT Token set in Authorization header for AUTH_SERVICE`);
                }
                else {
                    logger_1.logger.warn(`No JWT token found in session for AUTH_SERVICE`);
                }
                logger_1.logger.info(`Proxied request URL: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
                logger_1.logger.info(`Headers Sent: ${JSON.stringify(proxyReq.getHeaders())}`);
            },
            proxyRes: (proxyRes, req, res) => {
                let originalBody = [];
                proxyRes.on("data", function (chunk) {
                    originalBody.push(chunk);
                });
                proxyRes.on("end", function () {
                    const bodyString = Buffer.concat(originalBody).toString("utf8");
                    let responseBody;
                    try {
                        logger_1.logger.info(`Gateway recieved bodystrign ${bodyString}`);
                        responseBody = JSON.parse(bodyString);
                        logger_1.logger.info(`***Gateway received responsebody: ${JSON.stringify(responseBody, null, 2)}`);
                        // If Response Error, Not Modified Response
                        if (responseBody.errors) {
                            return res.status(proxyRes.statusCode).json(responseBody);
                        }
                        // Store JWT in session
                        if (responseBody.token) {
                            console.log("Hi token!", responseBody.token);
                            req.session.jwt = responseBody.token;
                            res.cookie("persistent", responseBody.token, cookieOption_1.OptionCookie);
                            delete responseBody.token;
                            logger_1.logger.info(`New JWT token stored in session for AUTH_SERVICE`);
                        }
                        if (responseBody.url) {
                            res.redirect(responseBody.url);
                        }
                        if (responseBody.verify_token) {
                            return res.json(responseBody);
                        }
                        if (responseBody.isLogout) {
                            res.clearCookie("session");
                            res.clearCookie("session.sig");
                            res.clearCookie("persistent");
                        }
                        // if (responseBody.status) {
                        //   return res.json(responseBody.status);
                        // }
                        // if (responseBody.message) {
                        //   return res.json(responseBody.message);
                        // }
                        // Modify response to send only the message to the client
                        return res.json({
                            status: responseBody.status,
                            message: responseBody.message,
                            role: responseBody.role,
                            id: responseBody.id,
                        });
                        console.log("Auth Data:", responseBody.role);
                        console.log("Auth Data:", responseBody.id);
                    }
                    catch (error) {
                        return res.status(500).json({ message: "Error parsing response" });
                    }
                });
            },
            error: (err, _req, res) => {
                logger_1.logger.error(`Proxy Error: ${err}`);
                switch (err.code) {
                    case "ECONNREFUSED":
                        res.status(consts_1.StatusCode.ServiceUnavailable).json({
                            message: "The service is temporarily unavailable. Please try again later.",
                        });
                        break;
                    case "ETIMEDOUT":
                        res.status(consts_1.StatusCode.GatewayTimeout).json({
                            message: "The request timed out. Please try again later.",
                        });
                        break;
                    default:
                        res
                            .status(consts_1.StatusCode.InternalServerError)
                            .json({ message: "An internal error occurred." });
                }
            },
        },
    },
    [routes_def_1.ROUTE_PATHS.COMPANY_SERVICE]: {
        target: config.companyserviceurl,
        changeOrigin: true,
        selfHandleResponse: true,
        pathRewrite: (path, _req) => {
            return `${routes_def_1.ROUTE_PATHS.COMPANY_SERVICE}${path}`;
        },
        on: {
            proxyReq: (proxyReq, req, _res) => {
                const expressReq = req;
                // Log the request payload
                expressReq.on("data", (chunk) => {
                    logger_1.logger.info(`Request Body Chunk: ${chunk}`);
                });
                // Extract JWT token from session
                const token = expressReq.session.jwt;
                proxyReq.setHeader("Authorization", `Bearer ${token}`);
                if (token) {
                    // proxyReq.setHeader("Authorization", `Bearer ${token}`);
                    logger_1.logger.info(`JWT Token set in Authorization header for AUTH_SERVICE`);
                }
                else {
                    logger_1.logger.warn(`No JWT token found in session for AUTH_SERVICE`);
                }
                logger_1.logger.info(`Proxied request URL: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
                logger_1.logger.info(`Headers Sent: ${JSON.stringify(proxyReq.getHeaders())}`);
                // Attach the original URL and method to the headers
                proxyReq.setHeader("X-Original-Url", expressReq.originalUrl);
                proxyReq.setHeader("X-Original-Method", expressReq.method);
            },
            proxyRes: (proxyRes, req, res) => {
                let originalBody = [];
                proxyRes.on("data", function (chunk) {
                    originalBody.push(chunk);
                });
                proxyRes.on("end", function () {
                    const bodyString = Buffer.concat(originalBody).toString("utf8");
                    logger_1.logger.info(`Response body: ${JSON.stringify(bodyString)}`);
                    logger_1.logger.info(`Response body: ${bodyString}`);
                    logger_1.logger.info(`Response body: ${originalBody}`);
                    let responseBody;
                    try {
                        logger_1.logger.info(`Gateway received bodystring ${bodyString}`);
                        responseBody = JSON.parse(bodyString);
                        logger_1.logger.info(`Gateway received responsebody ${responseBody}`);
                        // If Response Error, Not Modified Response
                        if (responseBody.errors) {
                            return res.status(proxyRes.statusCode).json(responseBody);
                        }
                        if (responseBody.token) {
                            req.session.jwt = responseBody.token;
                            res.cookie("persistent", responseBody.token, cookieOption_1.OptionCookie);
                            delete responseBody.token;
                        }
                        // Check if the original URL matches your delete API endpoint and the method is DELETE
                        const originalUrl = req.headers["x-original-url"];
                        const originalMethod = req.headers["x-original-method"];
                        if (originalMethod === "DELETE" &&
                            originalUrl &&
                            originalUrl.includes("/v1/companies/") &&
                            originalUrl.includes("/jobs/")) {
                            // If it matches, change the status code
                            logger_1.logger.info("Modifying status code for delete API response");
                            res.statusCode = 204; // Change the status code to 204 No Content
                        }
                        // Modify response to send only the message to the client
                        res.json({
                            message: responseBody.message,
                            data: responseBody.data,
                        });
                        // console.log("Data", responseBody.data);
                    }
                    catch (error) {
                        return res.status(500).json({ message: "Error parsing response" });
                    }
                });
            },
            error: (err, _req, res) => {
                logger_1.logger.error(`Proxy Error: ${err}`);
                switch (err.code) {
                    case "ECONNREFUSED":
                        res.status(consts_1.StatusCode.ServiceUnavailable).json({
                            message: "The service is temporarily unavailable. Please try again later.",
                        });
                        break;
                    case "ETIMEDOUT":
                        res.status(consts_1.StatusCode.GatewayTimeout).json({
                            message: "The request timed out. Please try again later.",
                        });
                        break;
                    default:
                        res
                            .status(consts_1.StatusCode.InternalServerError)
                            .json({ message: "An internal error occurred." });
                }
            },
        },
    },
    //  Abouting user services
    [routes_def_1.ROUTE_PATHS.USER_SERVICE]: {
        target: config.userServiceUrl,
        changeOrigin: true,
        selfHandleResponse: true,
        pathRewrite: (path, _req) => {
            return `${routes_def_1.ROUTE_PATHS.USER_SERVICE}${path}`;
        },
        on: {
            proxyReq: (proxyReq, req, _res) => {
                const expressReq = req;
                // Log the request payload
                expressReq.on("data", (chunk) => {
                    logger_1.logger.info(`Request Body Chunk: ${chunk}`);
                });
                // Extract JWT token from session
                const token = expressReq.session.jwt;
                proxyReq.setHeader("Authorization", `Bearer ${token}`);
                if (token) {
                    // proxyReq.setHeader("Authorization", `Bearer ${token}`);
                    logger_1.logger.info(`JWT Token set in Authorization header for AUTH_SERVICE`);
                }
                else {
                    logger_1.logger.warn(`No JWT token found in session for AUTH_SERVICE`);
                }
                logger_1.logger.info(`Proxied request URL: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
                logger_1.logger.info(`Headers Sent: ${JSON.stringify(proxyReq.getHeaders())}`);
            },
            proxyRes: (proxyRes, req, res) => {
                let originalBody = [];
                proxyRes.on("data", function (chunk) {
                    originalBody.push(chunk);
                });
                proxyRes.on("end", function () {
                    const bodyString = Buffer.concat(originalBody).toString("utf8");
                    let responseBody;
                    try {
                        logger_1.logger.info(`Gateway recieved bodystrign ${bodyString}`);
                        responseBody = JSON.parse(bodyString);
                        logger_1.logger.info(`Gateway received responsebody ${responseBody}`);
                        if (responseBody.errors) {
                            return res.status(proxyRes.statusCode).json(responseBody);
                        }
                        if (responseBody.token) {
                            req.session.jwt = responseBody.token;
                            res.cookie("persistent", responseBody.token, cookieOption_1.OptionCookie);
                            delete responseBody.token;
                        }
                        res.json({
                            message: responseBody.message,
                            data: responseBody.data,
                        });
                    }
                    catch (error) {
                        console.log(error);
                    }
                });
            },
            error: (err, _req, res) => {
                logger_1.logger.error(`Proxy Error: ${err}`);
                switch (err.code) {
                    case "ECONNREFUSED":
                        res.status(consts_1.StatusCode.ServiceUnavailable).json({
                            message: "The service is temporarily unavailable. Please try again later.",
                        });
                        break;
                    case "ETIMEDOUT":
                        res.status(consts_1.StatusCode.GatewayTimeout).json({
                            message: "The request timed out. Please try again later.",
                        });
                        break;
                    default:
                        res
                            .status(consts_1.StatusCode.InternalServerError)
                            .json({ message: "An internal error occurred." });
                }
            },
        },
    },
    //  FOR SAMPLE USER SEE ALL POST JOBS
    [routes_def_1.ROUTE_PATHS.POST]: {
        target: config.companyserviceurl,
        changeOrigin: true,
        selfHandleResponse: true,
        pathRewrite: (path, _req) => {
            return `${routes_def_1.ROUTE_PATHS.POST}${path}`;
        },
        on: {
            proxyReq: (proxyReq, req, _res) => {
                const expressReq = req;
                // Log the request payload
                expressReq.on("data", (chunk) => {
                    logger_1.logger.info(`Request Body Chunk: ${chunk}`);
                });
                // Extract JWT token from session
                const token = expressReq.session.jwt;
                proxyReq.setHeader("Authorization", `Bearer ${token}`);
                if (token) {
                    // proxyReq.setHeader("Authorization", `Bearer ${token}`);
                    logger_1.logger.info(`JWT Token set in Authorization header for AUTH_SERVICE`);
                }
                else {
                    logger_1.logger.warn(`No JWT token found in session for AUTH_SERVICE`);
                }
                logger_1.logger.info(`Proxied request URL: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
                logger_1.logger.info(`Headers Sent: ${JSON.stringify(proxyReq.getHeaders())}`);
            },
            proxyRes: (proxyRes, _req, res) => {
                let originalBody = [];
                proxyRes.on("data", function (chunk) {
                    originalBody.push(chunk);
                });
                proxyRes.on("end", function () {
                    const bodyString = Buffer.concat(originalBody).toString("utf8");
                    let responseBody;
                    try {
                        logger_1.logger.info(`Gateway recieved bodystrign ${bodyString}`);
                        responseBody = JSON.parse(bodyString);
                        logger_1.logger.info(`Gateway received responsebody ${responseBody}`);
                        // If Response Error, Not Modified Response
                        if (responseBody.errors) {
                            return res.status(proxyRes.statusCode).json(responseBody);
                        }
                        // if (responseBody.token) {
                        //   (req as Request).session!.jwt = responseBody.token;
                        //   res.cookie("persistent", responseBody.token, OptionCookie);
                        //   delete responseBody.token;
                        // }
                        // Modify response to send only the message to the client
                        res.json({
                            message: responseBody.message,
                            data: responseBody.data,
                        });
                        // console.log("Data", responseBody.data);
                    }
                    catch (error) {
                        return res.status(500).json({ message: "Error parsing response" });
                    }
                });
            },
            error: (err, _req, res) => {
                logger_1.logger.error(`Proxy Error: ${err}`);
                switch (err.code) {
                    case "ECONNREFUSED":
                        res.status(consts_1.StatusCode.ServiceUnavailable).json({
                            message: "The service is temporarily unavailable. Please try again later.",
                        });
                        break;
                    case "ETIMEDOUT":
                        res.status(consts_1.StatusCode.GatewayTimeout).json({
                            message: "The request timed out. Please try again later.",
                        });
                        break;
                    default:
                        res
                            .status(consts_1.StatusCode.InternalServerError)
                            .json({ message: "An internal error occurred." });
                }
            },
        },
    },
};
const applyProxy = (app) => {
    Object.keys(proxyConfigs).forEach((context) => {
        app.use(context, (0, http_proxy_middleware_1.createProxyMiddleware)(proxyConfigs[context]));
    });
    no: {
    }
};
exports.default = applyProxy;
//# sourceMappingURL=proxy.js.map