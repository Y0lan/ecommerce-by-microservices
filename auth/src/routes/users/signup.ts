import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import {BadRequestError} from "../../errors/bad-request-error";
import {validateRequest} from "../../middlewares/validate-request"
import {User} from "../../models/user";
import {app} from "../../app";

const router = express.Router();
router.post('/api/v1/users/signup', [
        body('email')
            .isEmail()
            .withMessage("Please enter a valid email address"),
        body('password')
            .trim()
            .isLength({min: 8, max: 1000})
            .withMessage("Password is too short")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = await req.body;
        const existingUser = await User.findOne({email});
        if (existingUser) {
            const message: string = `Email <${email}> already exists`
            console.log(message)
            throw new BadRequestError(message)
        }

        const user = User.build({email, password});
        await user.save();


        const user_jwt = jwt.sign({
            id: user.id,
            email: user.email,
        }, process.env.JWT_SECRET_KEY!)
        req.session = {
            jwt: user_jwt
        }
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.status(201).send(user)
    }
)
export {router as signupRouter};
