import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

export const SERVER_PORT = process.env.PORT_SERVER || 8443;

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'myscret';

const mongodb = {
    HOST: process.env.MONGO_HOST,
    PORT: process.env.MONGO_PORT,
    DB: process.env.MONGO_DATABASE
};
export default mongodb;
