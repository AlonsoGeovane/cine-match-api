import { response } from "express"
import { makeAnswersService } from "./answer.service.js"

export const makeAnswerController = () => {
    const service = makeAnswersService()

    const createOrUpdate = async (request, response, next) => {
        try {
            const { sessionId } = request.session;
            const { questionId, answer } = request.body;

            const result = await service.createOrUpdate({ sessionId, questionId, answer });

            return response.status(201).json(result)
        } catch (error) {
            next(error);
        }
    }

    return { createOrUpdate }
}