import { BaseQueue } from '@service/queues/base.queue';
import { IAuthJob } from '@auth/interfaces/auth.interface';
import { authWorker } from '@worker/auth.worker';

class AuthQueue extends BaseQueue {
    constructor() {
        super('auth');
        /**
         *  1st arg: 'addAuthUserToDB'  - name of the job like we called it from signup.ts controller.
         *  2nd arg: number of concurrency
         *  3rd arg: authWorker.addAuthUserToDB job.
         */
        this.processJob('addAuthUserToDB', 5, authWorker.addAuthUserToDB);
    }

    public addAuthUserJob(name: string, data: IAuthJob): void {
        this.addJob(name, data);
    }

}

export const authQueue: AuthQueue = new AuthQueue();