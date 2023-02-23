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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const Logging_1 = __importDefault(require("./library/Logging"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const port_server = config_1.SERVER_PORT;
// mongodb connection
const StartServer = () => {
    app.use((0, cors_1.default)());
    // parse requests of content-type - application/json
    app.use(express_1.default.json());
    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use('/api', routes_1.default);
    app.listen(port_server, () => {
        Logging_1.default.info(`⚡️[server]: Server is running at http://localhost:${port_server}`);
    });
};
(function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield require('./database/init.multi.mongodb');
            StartServer();
        }
        catch (error) {
            Logging_1.default.error(`error reason: ${error}`);
        }
    });
})();
