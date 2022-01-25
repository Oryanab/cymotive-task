import express from 'express';
import cors from 'cors';
import { middlewareServerError, middlewarePageNotFound } from './middlewares/errorhandlers';
import getRouter from './routes/getRoute';

// start app
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(middlewareServerError);
app.use(middlewarePageNotFound);

// Routes
app.use('/get', getRouter);

// test app listen
//app.listen(3000, () => console.log('connected'));
export default app;
