import { makeQuestionService } from "./question.service.js";

export const makeQuestionController = () => {
    const service = makeQuestionService();

    const getAllQuestions = async (_request, response, next) => {
        try {
            const questions = await service.getAllQuestions();
            response.status(200).json(questions);
        } catch (error) {
            next(error);
        }
    }

    return { getAllQuestions }
}