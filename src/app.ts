import express, { Express } from 'express';
import { HassonServer } from '@root/setupServer';
import dbConnection from '@root/setupDatabase';
import { config } from '@root/config';

class Application {
    public start(): void {
        this.loadConfig();
        dbConnection();
        const app: Express = express();
        const server: HassonServer = new HassonServer(app);
        server.start();
    }

    private loadConfig(): void {
        config.validateConfig();
        config.cloudinaryConfig();
    }
}

const application: Application = new Application();
application.start();
