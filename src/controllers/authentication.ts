import {Request, Response} from 'express';
import {getUserByEmail, createUser} from '../db/users'
import { random, authentication } from '../helpers';


export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.send({
                status: 400,
                message: "Email/Password not provided"
            })
        }
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.send({
                status: 400,
                message: "Email not found, please register"
            })
        }
        const  expectedPWHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedPWHash) {
            return  res.send({
                status: 403,
                message: "Wrong password provided"
            })
        }
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();

        res.cookie('TAIWO_AUTH', user.authentication.sessionToken, {domain: 'localhost', path: '/'})
        return res.send({
                status: 200,
                message: user
            }).end();
       
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
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