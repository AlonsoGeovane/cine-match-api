import { HttpError } from "../../utils/httpError.js";
import { makeQuestionRepoSequelize } from "../questions/question.repository.js";
import { makeAnswersRepoSequelize } from "./answers.repository.sequelize.js";

export const makeAnswersService = () => {
    const answerRepo = makeAnswersRepoSequelize();
    const questionRepo = makeQuestionRepoSequelize();

    const createOrUpdate = async ({ sessionId, questionId, answer }) => {
        if (!Array.isArray(answer) || answer.lenght === 0) {
            throw new HttpError('The answer must be a non-empty array', 400);
        }

        const question = await questionRepo.findById(questionId);
        if (!question) {
            throw new HttpError('Question not found', 400);
        }

        const invalidOptions = answer.filter(opt => !question.options.includes(opt));
        if (invalidOptions.length > 0) {
            throw new HttpError(`Invalid answer options: ${invalidOptions.join(',')} `, 400);
        }

        return await answerRepo.upsert({ sessionId, questionId, answer });
    }

    return { createOrUpdate }
}