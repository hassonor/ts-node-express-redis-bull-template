import * as process from 'process';
import mongoose from 'mongoose';
import Logger from 'bunyan';
import { config } from '@root/config';
import { redisConnection } from '@service/redis/redis.connection';

const log: Logger = config.createLogger('setupDB');
export default () => {
    const connect = () => {
        mongoose.set('strictQuery', true);
        mongoose
            .connect(`${config.DATABASE_URI}`)
            .then(() => {
                log.info('Successfully connected to database.');
                redisConnection.connect();
            })
            .catch((error) => {
                log.error('Error when connecting to database', error);
                return process.exit(1);
            });
    };
    connect();

    mongoose.connection.on('disconnected', connect);
};
