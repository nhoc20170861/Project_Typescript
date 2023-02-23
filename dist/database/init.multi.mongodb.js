"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Logging_1 = __importDefault(require("../library/Logging"));
const config_1 = __importDefault(require("../config/config"));
function newConnection(uri) {
    Logging_1.default.info(`uri:: ${uri}`);
    const conn = mongoose_1.default.createConnection(uri, {});
    conn.on('error', function (err) {
        Logging_1.default.error(`Mongodb::connection ${this.name} ${JSON.stringify(err)}`);
        process.exit();
    });
    conn.on('connected', function () {
        mongoose_1.default.set('debug', (col, method, query, doc) => {
            Logging_1.default.info(`Mongodb Debug-${this.name}-${col}-${method}-${JSON.stringify(query)}`);
        });
        console.log(`Mongodb::connected ${this.name}`);
    });
    conn.on('disconnected', function (err) {
        Logging_1.default.info(`Mongodb::disconnected ${this.name} :: ${JSON.stringify(err)}`);
    });
    return conn;
}
const testDb = newConnection(`mongodb://${config_1.default.HOST}:${config_1.default.PORT}/${config_1.default.DB}`);
exports.default = testDb;
