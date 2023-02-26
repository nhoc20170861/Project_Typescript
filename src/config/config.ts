import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

export const SERVER_PORT = process.env.PORT_SERVER;

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export const jwtExpiration = 3600; // 1 hour

export const jwtRefreshExpiration = 86400; // 24 hours

const mongodb = {
    HOST: process.env.MONGO_HOST,
    PORT: process.env.MONGO_PORT,
    DB: process.env.MONGO_DATABASE
};
export default mongodb;
