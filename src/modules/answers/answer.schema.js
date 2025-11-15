import { z } from 'zod';

export const answerSchemas = {
    createOrUpdate: z.object({
        questionId: z.number().int().positive('Invalid question ID'),
        answer: z.array(z.string()).min(1, 'The answer must be a non-empty array'),
    }),

};