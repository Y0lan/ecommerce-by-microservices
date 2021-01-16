import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import {RequestValidationError} from "../../errors/request-validation-error";
import {DatabaseConnectionError} from "../../errors/database-connection-error";

const router = express.Router();
router.post('/api/v1/users/signup', [
        body('email')
            .isEmail()
            .withMessage("Please enter a valid email address"),
        body('password')
            .trim()
            .isLength({min: 8, max: 1000})
            .withMessage("Password is too short")
    ], (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array())
        }
        const {email, password} = req.body;
        throw new DatabaseConnectionError()
    }
)
export {router as signupRouter};
