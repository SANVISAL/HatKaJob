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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = void 0;
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const userProfile_Controller_1 = require("./../controller/usercontroller/userProfile-Controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "mongoose.Types.ObjectId": {
        "dataType": "refAlias",
        "type": { "dataType": "string", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserProfille": {
        "dataType": "refObject",
        "properties": {
            "_id": { "ref": "mongoose.Types.ObjectId", "required": true },
            "profilePicture": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "contactPhone": { "dataType": "string", "required": true },
            "gender": { "dataType": "string", "required": true },
            "location": { "dataType": "string", "required": true },
            "dateOfBirth": { "dataType": "datetime", "required": true },
            "nationality": { "dataType": "string", "required": true },
            "address": { "dataType": "string", "required": true },
            "educationBackground": { "dataType": "string", "required": true },
            "favoriteCards": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "mongoose.Types.ObjectId" }, "required": true },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_IUserProfille_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "_id": { "ref": "mongoose.Types.ObjectId" }, "profilePicture": { "dataType": "string" }, "firstName": { "dataType": "string" }, "lastName": { "dataType": "string" }, "email": { "dataType": "string" }, "contactPhone": { "dataType": "string" }, "gender": { "dataType": "string" }, "location": { "dataType": "string" }, "dateOfBirth": { "dataType": "datetime" }, "nationality": { "dataType": "string" }, "address": { "dataType": "string" }, "educationBackground": { "dataType": "string" }, "favoriteCards": { "dataType": "array", "array": { "dataType": "refAlias", "ref": "mongoose.Types.ObjectId" } } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "ignore", "bodyCoercion": true });
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.post('/api/v1/users/all-profile', ...((0, runtime_1.fetchMiddlewares)(userProfile_Controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_Controller_1.UserController.prototype.GetAllUserController)), function UserController_GetAllUserController(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {};
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new userProfile_Controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'GetAllUserController',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/users/:id', ...((0, runtime_1.fetchMiddlewares)(userProfile_Controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_Controller_1.UserController.prototype.GetCardById)), function UserController_GetCardById(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new userProfile_Controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'GetCardById',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: 200,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/users/update-profile/:id', ...((0, runtime_1.fetchMiddlewares)(userProfile_Controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_Controller_1.UserController.prototype.UpdateUserController)), function UserController_UpdateUserController(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
                UpdateData: { "in": "body", "name": "UpdateData", "required": true, "ref": "Partial_IUserProfille_" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new userProfile_Controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'UpdateUserController',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/users/delete-profile/:id', ...((0, runtime_1.fetchMiddlewares)(userProfile_Controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_Controller_1.UserController.prototype.DeleteUserContrioller)), function UserController_DeleteUserContrioller(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });
                const controller = new userProfile_Controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'DeleteUserContrioller',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
exports.RegisterRoutes = RegisterRoutes;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
//# sourceMappingURL=routes.js.map