import { json, urlencoded } from 'express';
require('dotenv').config({ path: 'src/config/.env' });
import cors from 'cors';
import ip from 'ip';
import { greenBright, cyanBright } from 'chalk';
import { INTERNAL_LINKS } from '../enum';
import socketinit from './socket';
import  "../config/dbconfig";

const expressInit = (server) => {
    return new Promise((resolve, reject) => {
        /** Environments */
        const PORT = process.env.PORT || 3000;
        const HOST = process.env.HOST || 'localhost';

        /** Parse Req.body */
        server.use(json());
        server.use(urlencoded({ extended: true }));
        /** CORS */
        server.use(
            cors({
                origin: ['http://localhost:3000','https://node-special-engine.herokuapp.com/],
                methods: ['GET', 'POST'],
            }),
        );

        const BASE_API_URL = `http://${HOST}:${PORT}${INTERNAL_LINKS.BASE_API_URL}`;
        const NETWORK_BASE_API_URL = `http://${ip.address()}:${PORT}${
            INTERNAL_LINKS.BASE_API_URL
        }`;

        const socketServer = server.listen(PORT, () => {
            console.info(cyanBright('API Running at'));
            console.info(
                cyanBright(`${greenBright('\tLocalhost:')} ${BASE_API_URL}`),
            );
            console.info(
                cyanBright(`${greenBright('\tLAN:')} ${NETWORK_BASE_API_URL}`),
            );
        });
        socketinit(socketServer)
        resolve();
    });
};

export default expressInit;
