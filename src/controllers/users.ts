import express, {Request,Response } from 'express';

import { getUsers } from '../db/users';

export const getAllUsers = async( req: Request, res: Response) => {
    try {
        const users = await getUsers();
        return  res.send({
            status: 200,
            Message: users
        })
    } catch (error) {
        console.log(error)
        return res.send({
            status: 400,
            Message: "Cannot find user"
        })
    }
}