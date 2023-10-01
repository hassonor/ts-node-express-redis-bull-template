import express, { Router } from 'express';
import { SignupController } from '@auth/controllers/signup.controller';
import { SignInController } from '@auth/controllers/signin.controller';
import { SignOutController } from '@auth/controllers/signout.controller';
import { PasswordController } from '@auth/controllers/password.controller';

class AuthRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.post('/signup', SignupController.prototype.create);
        this.router.post('/signin', SignInController.prototype.read);
        this.router.post('/forgot-password', PasswordController.prototype.create);
        this.router.post('/reset-password/:token', PasswordController.prototype.update);
        return this.router;
    }

    public signoutRoute(): Router {
        this.router.get('/signout', SignOutController.prototype.update);

        return this.router;
    }
}

export const authRoutes: AuthRoutes = new AuthRoutes();