import { logInit } from "./src/utils/logger";

// Give winston a (silent) transport so tests don't warn about missing ones
logInit({ env: "testing", logLevel: "error" });
