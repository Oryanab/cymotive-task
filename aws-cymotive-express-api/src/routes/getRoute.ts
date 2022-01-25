import express from 'express';
const router = express.Router();

router.get('/', (_req: express.Request, res: express.Response) => {
  res.status(200).json({ message: 'you have successfully made a connection' });
});

export default router;
