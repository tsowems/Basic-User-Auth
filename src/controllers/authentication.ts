import {Request, Response} from 'express';
import {getUserByEmail, createUser} from '../db/users'
import { random, authentication } from '../helpers';

export const register = async(req: Request, res: Response) => {
    try {
        const {email, password, username} = req.body;
        if(!username || !email || !password) {
           
            return res.sendStatus(200);
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.send({
                status: 200,
                Message: "User already exist"
            });
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt,password)
            }
        });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.send({
                status: 200,
                Message: error
            });
    }
}