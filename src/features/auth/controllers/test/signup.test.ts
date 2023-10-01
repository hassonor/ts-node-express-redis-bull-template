/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import * as cloudinaryUploads from '@global/helpers/cloudinary-upload';
import { SignupController } from '@auth/controllers/signup.controller';
import { CustomError } from '@global/helpers/error-handler';

import { authService } from '@service/db/auth.service';
import { UserCache } from '@service/redis/user.cache';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';

jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/user.cache');
jest.mock('@service/queues/user.queue');
jest.mock('@service/queues/auth.queue');
jest.mock('@global/helpers/cloudinary-upload');

describe('SignUp', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it('should throw an error if username is not available', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: '',
                email: 'orh@google.com',
                password: 'qwerty1234',
                avatarColor: 'red',
                avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
            }
        ) as Request;
        const res: Response = authMockResponse();

        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Username is a required field');
        });
    });

    it('should throw an error if username length is less than minimum length', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'ma',
                email: 'orh@google.com',
                password: 'qwerty',
                avatarColor: 'red',
                avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid username');
        });
    });

    it('should throw an error if username length is greater than maximum length', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'mathematics',
                email: 'orh@google.com',
                password: 'qwerty',
                avatarColor: 'red',
                avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid username');
        });
    });

    it('should throw an error if email is not valid', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: 'not valid',
                password: 'qwerty',
                avatarColor: 'red',
                avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
            }
        ) as Request;
        const res: Response = authMockResponse();

        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Email must be valid');
        });
    });

    it('should throw an error if email is not available', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: '',
                password: 'qwerty',
                avatarColor: 'red',
                avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Email is a required field');
        });
    });

    it('should throw an error if password is not available', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: 'orh@google.com',
                password: '',
                avatarColor: 'red',
                avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Password is a required field');
        });
    });

    it('should throw an error if password length is less than minimum length', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: 'orh@google.com',
                password: 'ma',
                avatarColor: 'red',
                avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid password');
        });
    });

    it('should throw an error if password length is greater than maximum length', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: 'orh@google.com',
                password: 'mathematics1',
                avatarColor: 'red',
                avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid password');
        });
    });

    it('should throw unauthorized error is user already exist', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: 'orh@google.com',
                password: 'qwerty',
                avatarColor: 'red',
                avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
            }
        ) as Request;
        const res: Response = authMockResponse();

        jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(authMock);
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('The user already exist');
        });
    });

    it('should set session data for valid credentials and send correct json response', async() => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: 'orh@google.com',
                password: 'qwerty',
                avatarColor: 'red',
                avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
            }
        ) as Request;
        const res: Response = authMockResponse();

        jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(null as any);
        const userSpy = jest.spyOn(UserCache.prototype, 'saveUserToCache');
        jest.spyOn(cloudinaryUploads, 'uploads').mockImplementation((): any => Promise.resolve({
            version: '1234737373',
            public_id: '123456'
        }));

        await SignupController.prototype.create(req, res);
        expect(req.session?.jwt).toBeDefined();
        expect(res.json).toHaveBeenCalledWith({
            message: 'User were created successfully',
            user: userSpy.mock.calls[0][2],
            token: req.session?.jwt
        });
    });
});