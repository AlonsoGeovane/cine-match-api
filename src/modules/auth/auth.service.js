import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

export const makeAuthService = () => {
    const createSession = () => {
        const sessionId = uuidv4();

        const accessToken = jwt.sign({},
            env.jwtSecret,
            {
                subject: String(sessionId),
                expiresIn: env.jwtExpiresIn
            }
        )

        return { accessToken };
    }

    return { createSession }
};