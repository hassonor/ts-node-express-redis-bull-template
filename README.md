# BE: In Progress...

## How To Run:

1. Install and Run redis (CMD/WSL) https://redis.io/docs/getting-started/installation/install-redis-on-windows/
    1. After Installation of redis run: `sudo service redis-server start` (On WSL).
2. Install and Run redis commander(CMD/WSL) https://www.npmjs.com/package/redis-commander
    1. After Installation of redis-commander by npm globally , run `redis-commander` (On CMD).
3. Run `npm i`
4. Run `npm run dev`
5. For Testing Run: `npm run test`
6. Redis Cache URL: `http://localhost:8081`
7. Bull Queues: `http://localhost:5000/queues/queue/auth`


# API Request Examples

## 1. SignUp Request

**Endpoint:**  
`POST` http://localhost:5000/api/v1/signup

**Raw Body:**
```json
{
    "username": "orh4",
    "password": "zfq23546ydfg",
    "email": "or3424234assf@gmail.com",
    "avatarColor": "red",
    "avatarImage": ""
}
```

## 2. SignIn Request

**Endpoint:**  
`POST` http://localhost:5000/api/v1/signin

**Raw Body:**
```json
{
   "username": "orh4",
   "password": "zfq23546ydfg"
}
```

## 3. Forgot Password Request

**Endpoint:**  
`POST` http://localhost:5000/api/v1/forgot-password

**Raw Body:**
```json
{
   "email": "or3424234assf@gmail.com"
}
```

## 4. Reset Password Request
`Note: You need to paste the token from the mail.
`
**Endpoint:**  
`POST` http://localhost:5000/api/v1/forgot-password/:token

**Raw Body:**
```json
{
   "password": "someNewPassword",
   "confirmPassword": "someNewPassword"
}
```

## 5. SignOut Request

**Endpoint:**  
`GET` http://localhost:5000/api/v1/signout

## 6. CurrentUser Request

**Endpoint:**  
`GET` http://localhost:5000/api/v1/currentUser


