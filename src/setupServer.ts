import {
    Application,
    json,
    urlencoded,
    Response,
    Request,
    NextFunction,
} from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import Logger from 'bunyan';
import 'express-async-errors';
import * as process from 'process';
import { config } from '@root/config';
import applicationRoutes from '@root/routes';
import { IErrorResponse, CustomError } from '@root/shared/globals/helpers/error-handler';
import { SocketIOUserHandler } from "@socket/user.socket";

const log: Logger = config.createLogger('server');

export class HassonServer {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public start(): void {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routeMiddleware(this.app);
        this.globalErrorHandler(this.app);
        this.startServer(this.app);
    }

    private securityMiddleware(app: Application): void {
        app.use(
            cookieSession({
                name: 'session',
                keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_ONE!],
                maxAge: 24 * 7 * 3600000,
                secure: config.NODE_ENV !== 'development',
            })
        );
        app.use(hpp());
        app.use(helmet());
        app.use(
            cors({
                origin: config.CLIENT_URL,
                credentials: true,
                optionsSuccessStatus: 200,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            })
        );
    }

    private standardMiddleware(app: Application): void {
        app.use(compression());
        app.use(json({limit: '50mb'}));
        app.use(urlencoded({extended: true, limit: '50mb'}));
    }

    private routeMiddleware(app: Application): void {
        applicationRoutes(app);
    }

    private globalErrorHandler(app: Application): void {
        app.all('*', (req: Request, res: Response) => {
            res
                .status(HTTP_STATUS.NOT_FOUND)
                .json({message: `${req.originalUrl} not found`});
        });

        app.use(
            (
                error: IErrorResponse,
                _req: Request,
                res: Response,
                next: NextFunction
            ) => {
                log.error(error);
                if (error instanceof CustomError) {
                    return res.status(error.statusCode).json(error.serializeErrors());
                }
                next();
            }
        );
    }

    private async startServer(app: Application): Promise<void> {
        try {
            const httpServer: http.Server = new http.Server(app);
            const socketIO: Server = await this.createSocketIO(httpServer);
            this.startHttpServer(httpServer);
            this.socketIoConnections(socketIO);
        } catch (error) {
            log.error(error);
        }
    }

    private async createSocketIO(httpServer: http.Server): Promise<Server> {
        const io: Server = new Server(httpServer, {
            cors: {
                origin: config.CLIENT_URL,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            },
        });
        const pubClient = createClient({url: config.REDIS_HOST});
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]);
        io.adapter(createAdapter(pubClient, subClient));
        return io;
    }

    private startHttpServer(httpServer: http.Server): void {
        log.info(`Server has started with process ${process.pid}`);
        httpServer.listen(config.PORT, () =>
            log.info(`Server is running on port: ${config.PORT}`)
        );
    }

    private socketIoConnections(io: Server): void {
        const userSocketHandler: SocketIOUserHandler = new SocketIOUserHandler(io);
        userSocketHandler.listen();

    }
}
