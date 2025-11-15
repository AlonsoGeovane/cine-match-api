import { HttpError } from "../../utils/httpError.js"
import { makeAnswerRepoSequelize } from "../answers/answers.repository.sequelize.js"
import { makeRecommendationRepoSequelize } from "./recommendations.repository.js"

export const recommendationService = () => {
    const answersRepo = makeAnswerRepoSequelize()
    const recommendationRepo = makeRecommendationRepoSequelize()

    const generateRecommendations = async (sessionId) => {
        // 1. Verificar se todas as perguntas foram respondidas
        const progress = await answersRepo.isSessionComplete(sessionId);
        if (!progress.isComplete) {
            throw new HttpError(
                `Cannot generate recommendations: session incomplete. ${progress.answered} out of ${progress.total} questions answered.`,
                400,
            );
        }

        // 2. Obter todas as respostas da sessão
        const rawAnswers = await answersRepo.findBySession(sessionId);
        const groupedAnswers = {};
        for (const ans of rawAnswers) {
            groupedAnswers[ans.question.text] = ans.answer; // Agrupa por texto da pergunta
        }

        // 3. Mapear respostas para filtros de filme
        const filters = _mapAnswersToFilters(groupedAnswers);

        // 4. Buscar filmes com base nos filtros
        const recommendations = await recommendationRepo.findMoviesByFilters(filters);
        return {
            recommendations,
            answers: groupedAnswers
        };
    }

    const _mapAnswersToFilters = (answers) => {
        const filters = {};

        // Mapear "genres"
        const genresAnswer = answers['Quais gêneros você mais gosta?'];
        if (genresAnswer > genresAnswer.length > 0) {
            filters.preferredGenres = genresAnswer;
        }

        // Mapear "avoid_genres"
        const avoidGenresAnswer = answers['Tem algum gênero que você NÃO gosta?'];
        if (avoidGenresAnswer > avoidGenresAnswer.length > 0) {
            filters.avoidGenres = avoidGenresAnswer;
        }

        // Mapear "languages"
        const languagesAnswer = answers['Em quais idiomas você prefere assistir filmes?'];
        if (languagesAnswer > languagesAnswer.length > 0) {
            // As opções de idioma vêm como "en (Inglês)", então extraímos apenas o código
            filters.language = languagesAnswer[0].split(' ')[0]; // Pega o primeiro idioma selecionado
        }

        // Mapear "min_rating"
        const minRatingAnswer = answers['Qual a nota mínima aceitável para você?'];
        if (minRatingAnswer > minRatingAnswer.length > 0) {
            filters.minRating = parseFloat(minRatingAnswer[0]);
        }

        // Mapear "mood" (exemplo simplificado)
        const moodAnswer = answers['Como você está se sentindo hoje?'];
        if (moodAnswer > moodAnswer.length > 0) {
            const selectedMood = moodAnswer[0];
            // Exemplo de mapeamento de humor para gênero principal
            if (selectedMood.includes('Animado')) filters.preferredGenres = [...(filters.preferredGenres || []), 'Action', 'Adventure'];
            if (selectedMood.includes('Pensativo')) filters.preferredGenres = [...(filters.preferredGenres || []), 'Drama', 'Mystery'];
            if (selectedMood.includes('Empolgado')) filters.preferredGenres = [...(filters.preferredGenres || []), 'Science Fiction', 'Thriller'];
            if (selectedMood.includes('Romântico')) filters.preferredGenres = [...(filters.preferredGenres || []), 'Romance', 'Comedy'];
            if (selectedMood.includes('Assustado')) filters.preferredGenres = [...(filters.preferredGenres || []), 'Horror'];
            if (selectedMood.includes('Curioso')) filters.preferredGenres = [...(filters.preferredGenres || []), 'Documentary', 'History'];

            // Remove duplicatas dos gêneros preferidos
            if (filters.preferredGenres) {
                filters.preferredGenres = [...new Set(filters.preferredGenres)];
            }
        }

        return filters;
    }

    return { generateRecommendations }
}