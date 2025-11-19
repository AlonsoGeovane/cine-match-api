import { z } from 'zod';

export const answerSchemas = {
    createOrUpdate: z.object({
        questionId: z.uuid('Invalid question ID'),
        answer: z.array(z.string()).min(1, 'The answer must be a non-empty array'),
    }),

};