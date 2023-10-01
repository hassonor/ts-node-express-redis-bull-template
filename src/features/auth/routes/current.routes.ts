import express, { Router } from 'express';
import { CurrentUserController } from '@auth/controllers/currentUser.controller';
import { authMiddleware } from '@global/helpers/auth-middleware';

class CurrentUserRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }


    public routes(): Router {
        this.router.get('/currentUser', authMiddleware.checkAuthentication, CurrentUserController.prototype.read);

        return this.router;
    }
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();