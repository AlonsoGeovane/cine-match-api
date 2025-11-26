import { HttpError } from "../../utils/httpError.js"
import { makeAnswersRepoSequelize } from "../answers/answers.repository.sequelize.js"
import { makeRecommendationRepoSequelize } from "./recommendations.repository.js"

// ⚠️ NOTA DE CORREÇÃO: Os IDs das perguntas foram removidos, pois os dados brutos
// fornecidos pelo usuário possuem 'questionId: null'.
// A lógica de mapeamento agora depende da ordem ou conteúdo das respostas brutas, 
// o que é uma SOLUÇÃO PROVISÓRIA para o problema de dados.

export const recommendationService = () => {
    const answersRepo = makeAnswersRepoSequelize()
    const recommendationRepo = makeRecommendationRepoSequelize()

    const generateRecommendations = async (sessionId) => {
        const progress = await answersRepo.isSessionComplete(sessionId);
        if (!progress.isComplete) {
            throw new HttpError(
                `Cannot generate recommendations: session incomplete. ${progress.answered} out of ${progress.total} questions answered.`,
                400,
            );
        }

        const rawAnswers = await answersRepo.findBySession(sessionId);

        const filters = _mapAnswersToFilters(rawAnswers);

        const recommendations = await recommendationRepo.findMoviesByFilters(filters);

        return {
            recommendations,
            answers: rawAnswers
        };
    }

    // ----------------------------------------------------------------------
    // Lógica de Mapeamento (Auxiliar)
    // ----------------------------------------------------------------------

    // 💡 Recebe o array completo de respostas brutas
    const _mapAnswersToFilters = (rawAnswers) => {
        const filters = {
            preferredGenres: [],
            moodBoostGenres: [],
            avoidGenres: [],
            languages: [], // Adicionado 'languages' para inicialização
            minRating: 0 // Adicionado 'minRating' para inicialização
        };

        // ⚠️ CORREÇÃO CRÍTICA: Mapeamento baseado no ÍNDICE/ORDEM do array de respostas 
        // fornecido na sua amostra. Esta lógica falhará se a ordem das respostas mudar.
        const moodAnswer = rawAnswers[0]?.answer; // Ex: ["Animado (Action, Adventure)"]
        const genresAnswer = rawAnswers[1]?.answer; // Ex: ["Action"]
        const languagesAnswer = rawAnswers[2]?.answer; // Ex: ["en"]
        const avoidGenresAnswer = rawAnswers[3]?.answer; // Ex: ["Documentary"]
        const minRatingAnswer = rawAnswers[4]?.answer; // Ex: ["9.0"]

        // 1. Mapear Gêneros Preferidos (Filtro PRINCIPAL)
        if (Array.isArray(genresAnswer) && genresAnswer.length > 0) {
            filters.preferredGenres = genresAnswer;
        }

        // 2. Mapear Gêneros Evitados (Filtro EXCLUDENTE)
        if (Array.isArray(avoidGenresAnswer) && avoidGenresAnswer.length > 0) {
            filters.avoidGenres = avoidGenresAnswer;
        }

        // 3. Mapear Humor (Gêneros de REFORÇO Opcional)
        if (Array.isArray(moodAnswer) && moodAnswer.length > 0) {
            const selectedMood = moodAnswer[0];
            const boost = [];

            // Mapeamento de Humor para Gêneros Secundários (Reforço)
            if (selectedMood.includes('Animado')) boost.push('Action', 'Adventure');
            if (selectedMood.includes('Pensativo')) boost.push('Drama', 'Mystery');
            if (selectedMood.includes('Empolgado')) boost.push('Science Fiction', 'Thriller');
            if (selectedMood.includes('Romântico')) boost.push('Romance', 'Comedy');
            if (selectedMood.includes('Assustado')) boost.push('Horror');
            if (selectedMood.includes('Curioso')) boost.push('Documentary', 'History');

            // Evita adicionar gêneros de boost que já são preferidos.
            filters.moodBoostGenres = boost.filter(
                genre => !filters.preferredGenres.includes(genre)
            );
        }

        // 4. Mapear Idioma (MELHORIA: Extração de Código e Multi-seleção)
        if (Array.isArray(languagesAnswer) && languagesAnswer.length > 0) {
            filters.languages = languagesAnswer.map(fullLang => {
                const match = fullLang.match(/^(\w+)/);
                return match ? match[1] : null;
            }).filter(code => code !== null);
        } else {
            filters.languages = [];
        }


        // 5. Mapear Nota Mínima
        if (Array.isArray(minRatingAnswer) && minRatingAnswer.length > 0) {
            filters.minRating = parseFloat(minRatingAnswer[0]);
        }

        return filters;
    }

    return { generateRecommendations }
}