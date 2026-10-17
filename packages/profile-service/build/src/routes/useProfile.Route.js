"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ROUTE_PATHS = {
    PROFILE: {
        BASE: "v1/user",
        GET_ALL: "/all-profile",
        UPDATE: "/update-profile/:id", // As an example
        GET_BY_ID: "/:id",
        DELETE: "/delete-profile/:id",
        // Add other auth-related routes here
    },
    // Define other route groups as needed
};
exports.default = ROUTE_PATHS;
//# sourceMappingURL=useProfile.Route.js.map