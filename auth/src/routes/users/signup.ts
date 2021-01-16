import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import {RequestValidationError} from "../../errors/request-validation-error";
import {BadRequestError} from "../../errors/bad-request-error";
import {User} from "../../models/user";

const router = express.Router();
router.post('/api/v1/users/signup', [
        body('email')
            .isEmail()
            .withMessage("Please enter a valid email address"),
        body('password')
            .trim()
            .isLength({min: 8, max: 1000})
            .withMessage("Password is too short")
    ], async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array())
        }
        const {email, password} = await req.body;
        const existingUser = await User.findOne({email});
        if (existingUser) {
            const message: string = `Email <${email}> already exists`
            console.log(message)
            throw new BadRequestError(message)
        }

        const user = User.build({email, password});
        await user.save();
        res.status(201).send(user)
    }
)
export {router as signupRouter};
