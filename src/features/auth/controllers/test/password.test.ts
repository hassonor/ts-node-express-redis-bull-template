/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { PasswordController } from '@auth/controllers/password.controller';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { CustomError } from '@global/helpers/error-handler';
import { emailQueue } from '@service/queues/email.queue';
import { authService } from '@service/db/auth.service';

const WRONG_EMAIL = 'orhasson@email.com';
const CORRECT_EMAIL = 'orhasson@me.com';
const INVALID_EMAIL = 'test';
const CORRECT_PASSWORD = 'orh1234';

jest.mock('@service/queues/base.queue');
jest.mock('@service/queues/email.queue');
jest.mock('@service/db/auth.service');
jest.mock('@service/emails/mail.transport');

describe('Password', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should throw an error if email is invalid', () => {
            const req: Request = authMockRequest({}, {email: INVALID_EMAIL}) as Request;
            const res: Response = authMockResponse();
            PasswordController.prototype.create(req, res).catch((error: CustomError) => {
                expect(error.statusCode).toEqual(400);
                expect(error.serializeErrors().message).toEqual('Field must be valid');
            });
        });

        it('should throw "Invalid credentials" if email does not exist', () => {
            const req: Request = authMockRequest({}, {email: WRONG_EMAIL}) as Request;
            const res: Response = authMockResponse();
            jest.spyOn(authService, 'getAuthUserByEmail').mockResolvedValue(null as any);
            PasswordController.prototype.create(req, res).catch((error: CustomError) => {
                expect(error.statusCode).toEqual(400);
                expect(error.serializeErrors().message).toEqual('Invalid credentials');
            });
        });

        it('should send correct json response', async() => {
            const req: Request = authMockRequest({}, {email: CORRECT_EMAIL}) as Request;
            const res: Response = authMockResponse();
            jest.spyOn(authService, 'getAuthUserByEmail').mockResolvedValue(authMock);
            jest.spyOn(emailQueue, 'addEmailJob');
            await PasswordController.prototype.create(req, res);
            expect(emailQueue.addEmailJob).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Password reset email were sent.'
            });
        });
    });

    describe('update', () => {
        it('should throw an error if password is empty', () => {
            const req: Request = authMockRequest({}, {password: ''}) as Request;
            const res: Response = authMockResponse();
            PasswordController.prototype.update(req, res).catch((error: CustomError) => {
                expect(error.statusCode).toEqual(400);
                expect(error.serializeErrors().message).toEqual('Password is a required field');
            });
        });

        it('should throw an error if password and confirmPassword are different', () => {
            const req: Request = authMockRequest({}, {
                password: CORRECT_PASSWORD,
                confirmPassword: `${CORRECT_PASSWORD}2`
            }) as Request;
            const res: Response = authMockResponse();
            PasswordController.prototype.update(req, res).catch((error: CustomError) => {
                expect(error.statusCode).toEqual(400);
                expect(error.serializeErrors().message).toEqual('Passwords should match');
            });
        });

        it('should throw error if reset token had expired', () => {
            const req: Request = authMockRequest({}, {
                password: CORRECT_PASSWORD,
                confirmPassword: CORRECT_PASSWORD
            }, null, {
                token: ''
            }) as Request;
            const res: Response = authMockResponse();
            jest.spyOn(authService, 'getAuthUserByPasswordToken').mockResolvedValue(null as any);
            PasswordController.prototype.update(req, res).catch((error: CustomError) => {
                expect(error.statusCode).toEqual(400);
                expect(error.serializeErrors().message).toEqual('Reset token had expired.');
            });
        });

        it('should send correct json response', async() => {
            const req: Request = authMockRequest({}, {
                password: CORRECT_PASSWORD,
                confirmPassword: CORRECT_PASSWORD
            }, null, {
                token: '12sde3'
            }) as Request;
            const res: Response = authMockResponse();
            jest.spyOn(authService, 'getAuthUserByPasswordToken').mockResolvedValue(authMock);
            jest.spyOn(emailQueue, 'addEmailJob');
            await PasswordController.prototype.update(req, res);
            expect(emailQueue.addEmailJob).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Password successfully updated.'
            });
        });
    });
});