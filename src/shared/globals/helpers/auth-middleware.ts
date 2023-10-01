import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { config } from '@root/config';
import { NotAuthorizedError } from '@global/helpers/error-handler';
import { AuthPayload } from '@auth/interfaces/auth.interface';


export class AuthMiddleware {
    public verifyUser(req: Request, res: Response, next: NextFunction): void {
        if (!req.session?.jwt) {
            throw new NotAuthorizedError('Token is not available or Expired. Please login again.');
        }
        try {
            req.currentUser = JWT.verify(req.session?.jwt, config.JWT_TOKEN!) as AuthPayload;
        } catch (error) {
            throw new NotAuthorizedError('Token is invalid. Please login again.');
        }
        next();
    }

    public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
        if (!req.currentUser) {
            throw new NotAuthorizedError('Authentication is required to access this route.');
        }
        next();
    }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();