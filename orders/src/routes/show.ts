import express, {Request, Response} from "express";

const router = express.Router()
router.get('/api/v1/orders/:orderId', async (req: Request, res: Response) => {
    res.send({})
})

export { router as showOrderRouter };
