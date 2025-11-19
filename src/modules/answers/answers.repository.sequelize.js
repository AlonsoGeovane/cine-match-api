import { Answers } from "../../models/answers.js";
import { Questions } from "../../models/Questions.js";

export const makeAnswersRepoSequelize = () => {
    const upsert = async ({ sessionId, questionId, answer }) => {
         // Use create para sempre gerar um novo registro
        const newAnswer = await Answers.create({ sessionId, questionId, answer })

        // Buscar o registro REAL após a criação para incluir a questão
        const answerRecord = await Answers.findByPk(newAnswer.id, {
            include: [
                {
                    model: Questions,
                    as: 'question',
                    attributes: ['id', 'text'] // Use 'question' se esse for o nome da coluna no model Questions
                }
            ]
        })
        return answerRecord ? answerRecord.toJSON() : null
    }
    const findBySession = async (sessionId) => {
        const answers = await Answers.findAll({
            where: { sessionId },
            include: [
                {
                    model: Questions,
                    as: 'question',
                    attributes: ['id', 'text', 'options']
                }
            ],
        });
        return answers.map(a => a.toJSON());
    }
    const findById = async (id) => {
        const answer = await Answers.findByPk(id, {
            include: [
                {
                    model: Questions,
                    as: 'question',
                    attributes: ['id', 'text', 'options']
                }
            ]
        });

        return answer ? answer.toJSON() : null;
    }
    const deleteBySession = async (sessionId) => {
        return await Answers.destroy({ where: { sessionId } });
    }

    const countBySession = async (sessionId) => {
        return await Answers.count({ where: { sessionId } });
    }

    const isSessionComplete = async (sessionId) => {
        const totalQuestions = await Questions.count();
        const answeredQuestions = await countBySession(sessionId);

        return {
            total: totalQuestions,
            answered: answeredQuestions,
            isComplete: answeredQuestions >= totalQuestions,
            percentage: Math.round((answeredQuestions / totalQuestions) * 100)
        };
    }

    return {
        upsert,
        findById,
        deleteBySession,
        countBySession,
        isSessionComplete,
        findBySession
    }
}
