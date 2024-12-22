import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, "Unathorized"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(401, "Unathorized"));
        }
        req.user = user;
        next();
    });
};

export const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, "לא מורשה"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(401, "לא מורשה"));
        }

        if (!user?.isAdmin) {
            return next(errorHandler(403, "גישה אסורה"));
        }

        req.user = user;
        next();
    });
};