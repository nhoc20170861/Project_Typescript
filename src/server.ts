import express, { Express } from 'express';
import cors from 'cors';

import db from './models';
import mongodb, { SERVER_PORT } from './config/config';
import Logging from './library/Logging';
import routes from './routes';
import Role from './models/role.model';
const app: Express = express();

const port_server = SERVER_PORT;

// mongodb connection
// db.mongoose.set('debug',true);
//console.log(`mongodb://${mongodb.HOST}:${mongodb.PORT}/${mongodb.DB}`)
db.mongoose
    .connect(`mongodb://${mongodb.HOST}:${mongodb.PORT}/${mongodb.DB}`, {})
    .then(() => {
        Logging.info('Connected to the database!');
        // initial();
        StartServer();
    })
    .catch((err) => {
        Logging.error('Unable to connect: ');
        Logging.error(err);
        process.exit();
    });

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

