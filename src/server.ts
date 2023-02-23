import express, { Express } from 'express';
import cors from 'cors';

import { SERVER_PORT } from './config/config';
import Logging from './library/Logging';
import routes from './routes';
const app: Express = express();

const port_server = SERVER_PORT;

// mongodb connection

const StartServer = () => {
    app.use(cors());

    // parse requests of content-type - application/json
    app.use(express.json());

    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    app.use('/api', routes);

    app.listen(port_server, () => {
        Logging.info(`⚡️[server]: Server is running at http://localhost:${port_server}`);
    });
};
(async function startApp() {
    try {
        await require('./database/init.multi.mongodb');
        StartServer();
    } catch (error) {
        Logging.error(`error reason: ${error}`);
    }
})();
