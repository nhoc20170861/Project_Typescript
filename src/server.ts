import express, { Express, Request, Response } from 'express';
import * as mongoose from 'mongoose';
import cors from 'cors';
import mongodb, { SERVER_PORT } from './config/config';
import Logging from './library/Logging';
import routes from './routes';
import Role from './models/role.model';
const app: Express = express();

const port_server = SERVER_PORT;

// mongodb connection

mongoose
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
    //Set all routes from routes folder
    app.use('/api', routes);
    app.listen(port_server, () => {
        Logging.info(`⚡️[server]: Server is running at http://localhost:${port_server}`);
    });
};

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: 'user'
            }).save((err) => {
                if (err) {
                    console.log('error', err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: 'moderator'
            }).save((err) => {
                if (err) {
                    console.log('error', err);
                }

                console.log("added 'moderator' to roles collection");
            });

            new Role({
                name: 'admin'
            }).save((err) => {
                if (err) {
                    console.log('error', err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}
