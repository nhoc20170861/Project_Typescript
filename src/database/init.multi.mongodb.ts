import mongoose from 'mongoose';
import Logging from '../library/Logging';
import mongodb from '../config/config';
function newConnection(uri: string) {
    Logging.info(`uri:: ${uri}`);
    const conn = mongoose.createConnection(uri, {});
    conn.on('error', function (this: typeof conn, err) {
        Logging.error(`Mongodb::connection ${this.name} ${JSON.stringify(err)}`);
        process.exit();
    });

    conn.on('connected', function (this: typeof conn) {
        mongoose.set('debug', (col, method, query, doc) => {
            Logging.info(`Mongodb Debug-${this.name}-${col}-${method}-${JSON.stringify(query)}`);
        });
        console.log(`Mongodb::connected ${this.name}`);
    });

    conn.on('disconnected', function (this: typeof conn, err) {
        Logging.info(`Mongodb::disconnected ${this.name} :: ${JSON.stringify(err)}`);
    });
    return conn;
}
const testDb = newConnection(`mongodb://${mongodb.HOST}:${mongodb.PORT}/${mongodb.DB}`);
export default testDb;