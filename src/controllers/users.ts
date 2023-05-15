import express, {Request,Response } from 'express';

import { deleteUserById, getUserById, getUsers } from '../db/users';

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

export const deleteUser = async(req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const deletedUser = await deleteUserById(id);
        return res.json(deletedUser);
    } catch(error) {
        console.log(error);
        return res.send({
            status: 400,
            Message: "Cannot delete user"
        })
    }
}

export const updateUser = async(req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {username} = req.body;
        if(!username) {
            return res.send({
            status: 400,
            Message: "Supply username"
        })
        }

        const user = await getUserById(id);
        user.username = username;
        await user.save();

        return res.send({
            status: 400,
            Message: user
        }).end()

    } catch(error) {
         console.log(error);
        return res.send({
            status: 400,
            Message: "Cannot update user"
        })
    }
}