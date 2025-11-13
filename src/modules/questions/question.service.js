import { makeQuestionRepoSequelize } from "./question.repository.js";

export const makeQuestionService = () => {
    const repo = makeQuestionRepoSequelize();

    const getAllQuestions = async () => {
        const questions = await repo.findAll();
        return questions;
    }

    return { getAllQuestions }

}