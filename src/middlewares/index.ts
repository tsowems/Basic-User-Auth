import {NextFunction, Request, Response} from 'express';

import { get, merge} from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isAuthenticated = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies['TAIWO_AUTH'];
        if (!sessionToken) {
            return res.send({
                status: 403,
                Message: "Invalid session"
            })
        }
        const existingUser = await getUserBySessionToken(sessionToken);
           if (!existingUser) {
            return res.send({
                status: 403,
                Message: "User not valid"
            })
        }

        merge(req, {identity: existingUser});

        return next();
    } catch(error) {
        console.log(error);
        return res.sendStatus(400);
    }
}