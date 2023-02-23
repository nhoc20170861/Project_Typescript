"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderatorBoard = exports.adminBoard = exports.userBoard = exports.allAccess = void 0;
// API for all roles
const allAccess = (req, res) => {
    res.status(200).send('Public Content.');
};
exports.allAccess = allAccess;
// API for user roles
const userBoard = (req, res) => {
    res.status(200).send('User Content.');
};
exports.userBoard = userBoard;
// API for admin role
const adminBoard = (req, res) => {
    res.status(200).send('Admin Content.');
};
exports.adminBoard = adminBoard;
// API for moderator
const moderatorBoard = (req, res) => {
    res.status(200).send('Moderator Content.');
};
exports.moderatorBoard = moderatorBoard;
