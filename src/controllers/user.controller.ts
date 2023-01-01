import { Request, Response } from 'express';

// API for all roles
export const allAccess = (req: Request, res: Response) => {
    res.status(200).send('Public Content.');
};

// API for user roles
export const userBoard = (req: Request, res: Response) => {
    res.status(200).send('User Content.');
};

// API for admin role
export const adminBoard = (req: Request, res: Response) => {
    res.status(200).send('Admin Content.');
};

// API for moderator
export const moderatorBoard = (req: Request, res: Response) => {
    res.status(200).send('Moderator Content.');
};
