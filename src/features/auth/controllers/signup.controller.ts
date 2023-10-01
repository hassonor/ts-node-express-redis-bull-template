import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';
import { JoiValidation } from '@global/decorators/joi-validation.decorators';
import { signupSchema } from '@auth/schemes/signup';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@global/helpers/cloudinary-upload';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserCache } from '@service/redis/user.cache';
import { config } from '@root/config';
import { authQueue } from '@service/queues/auth.queue';
import { userQueue } from '@service/queues/user.queue';

const userCache: UserCache = new UserCache();

export class SignupController {
    @JoiValidation(signupSchema)
    public async create(req: Request, res: Response): Promise<void> {
        const {username, email, password, avatarColor, avatarImage} = req.body;
        const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
        if (checkIfUserExist) {
            throw new BadRequestError('The user already exist');
        }

        const authObjectId: ObjectId = new ObjectId();
        const userObjectId: ObjectId = new ObjectId();
        const uId = `${Helpers.generateRandomIntegers(12)}`;
        const authData: IAuthDocument = SignupController.prototype.signUpData({
            _id: authObjectId, uId, username, email, password, avatarColor
        });

        const result: UploadApiResponse = await uploads(avatarImage, `${userObjectId}`, true, true) as UploadApiResponse;
        if (!result?.public_id) {
            throw new BadRequestError('File upload: Error occurred. Try again.');
        }

        // Add to redis cache
        const userDataForCache: IUserDocument = SignupController.prototype.userData(authData, userObjectId);
        userDataForCache.profilePicture = `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${result.version}/${userObjectId}`;
        await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);

        // Add to database
        authQueue.addAuthUserJob('addAuthUserToDB', {value: authData});
        userQueue.addUserJob('addUserToDB', {value: userDataForCache});

        const userJwt: string = SignupController.prototype.signToken(authData, userObjectId);
        req.session = {jwt: userJwt};

        res.status(HTTP_STATUS.CREATED).json({
            message: 'User were created successfully',
            user: userDataForCache,
            token: userJwt
        });
    }

    private signToken(data: IAuthDocument, userObjectId: ObjectId): string {
        return JWT.sign({
            userId: userObjectId,
            uId: data.uId,
            email: data.email,
            username: data.username,
            avatarColor: data.avatarColor
        }, config.JWT_TOKEN!, {expiresIn: config.TOKEN_EXPIRES_IN_HOURS});
    }


    signUpData(data: ISignUpData): IAuthDocument {
        const {_id, username, email, uId, password, avatarColor} = data;
        return {
            _id,
            username: Helpers.firstLetterUppercase(username),
            email: Helpers.lowerCase(email),
            uId,
            password,
            avatarColor,
            createdAt: new Date()
        } as IAuthDocument;
    }

    private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
        const {_id, username, email, uId, password, avatarColor} = data;
        return {
            _id: userObjectId,
            authId: _id,
            uId,
            username: Helpers.firstLetterUppercase(username),
            email,
            password,
            avatarColor,
            profilePicture: '',
            blocked: [],
            blockedBy: [],
            work: '',
            location: '',
            school: '',
            quote: '',
            bgImageVersion: '',
            bgImageId: '',
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
            notifications: {
                messages: true,
                reactions: true,
                comments: true,
                follows: true
            },
            social: {
                facebook: '',
                instagram: '',
                twitter: '',
                youtube: '',
                linkedin: ''
            }
        } as unknown as IUserDocument;
    }
}