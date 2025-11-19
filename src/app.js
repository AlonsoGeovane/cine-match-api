import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authRouter } from './routes/auth.routes.js';
import { questionRouter } from './routes/question.routes.js';
import { recommendationRouter } from './routes/recommendations.routes.js';
import { answerRouter } from './routes/answer.routes.js';

export const createApp = () => {
    const app = express();

    // 1) Middlewares globais
    app.use(express.json());
    app.use(helmet());
    app.use(cors({ origin: env.corsOrigin })); // restrinja em produção
    app.use(rateLimit({ windowMs: 60_000, max: 100 })); // throttle básico

    // 2) Healthcheck
    app.get('/health', (_req, res) => res.json({ ok: true }));

    app.use("/auth", authRouter())
    app.use("/questions", questionRouter())
    app.use("/answers", answerRouter())
    app.use("/recommedations", recommendationRouter())

    app.use(errorHandler)


    return app;
};