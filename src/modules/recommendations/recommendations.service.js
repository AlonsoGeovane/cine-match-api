import { HttpError } from "../../utils/httpError.js"
import { makeAnswersRepoSequelize } from "../answers/answers.repository.sequelize.js"
import { makeRecommendationRepoSequelize } from "./recommendations.repository.js"

// 🔑 DEFINIÇÃO ESTÁVEL DOS IDs DAS PERGUNTAS (Baseado nos dados brutos fornecidos)
// **NOTA:** Em um ambiente de produção real, estes IDs devem ser injetados ou buscados.
const QUESTION_IDS = {
    MOOD: '722797d2-5718-407e-8759-db27c43e2243',
    PREFERRED_GENRES: 'a340baf0-78ae-4449-9d9b-c10a1827f715',
    AVOID_GENRES: 'feb9b9eb-5d76-41eb-aac1-8b685aa74207',
    LANGUAGE: 'bfd58c0e-95ee-40b3-99b4-88e20b7cc3f6',
    MIN_RATING: '84e9a07f-f0b3-4474-aef1-5b0614ad0191',
}

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
        const groupedAnswersById = {};

        // 💡 CORREÇÃO: Agrupamento pelo questionId para desacoplar do texto.
        for (const ans of rawAnswers) {
            const id = ans.questionId;
            if (id) {
                groupedAnswersById[id] = ans.answer;
            }
        }

        // Mapear respostas para filtros de filme
        const filters = _mapAnswersToFilters(groupedAnswersById);

        const recommendations = await recommendationRepo.findMoviesByFilters(filters);

        return {
            recommendations,
            answers: groupedAnswersById
        };
    }

    // ----------------------------------------------------------------------
    // Lógica de Mapeamento (Auxiliar)
    // ----------------------------------------------------------------------

    const _mapAnswersToFilters = (answers) => {
        const filters = {
            preferredGenres: [],
            moodBoostGenres: [],
            avoidGenres: [],
        };

        const moodAnswer = answers[QUESTION_IDS.MOOD];
        const genresAnswer = answers[QUESTION_IDS.PREFERRED_GENRES];
        const avoidGenresAnswer = answers[QUESTION_IDS.AVOID_GENRES];
        const languagesAnswer = answers[QUESTION_IDS.LANGUAGE];
        const minRatingAnswer = answers[QUESTION_IDS.MIN_RATING];

        // 1. Mapear Gêneros Preferidos (Filtro PRINCIPAL)
        if (Array.isArray(genresAnswer) && genresAnswer.length > 0) {
            // O valor da opção é o nome do gênero (ex: 'Thriller')
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
            // Se o usuário selecionou 'Assustado (Horror)', 'Horror' é adicionado.
            if (selectedMood.includes('Animado')) boost.push('Action', 'Adventure');
            if (selectedMood.includes('Pensativo')) boost.push('Drama', 'Mystery');
            if (selectedMood.includes('Empolgado')) boost.push('Science Fiction', 'Thriller');
            if (selectedMood.includes('Romântico')) boost.push('Romance', 'Comedy');
            if (selectedMood.includes('Assustado')) boost.push('Horror');
            if (selectedMood.includes('Curioso')) boost.push('Documentary', 'History');

            // 💡 MELHORIA: Evita adicionar gêneros de boost que já são preferidos.
            filters.moodBoostGenres = boost.filter(
                genre => !filters.preferredGenres.includes(genre)
            );
        }

        // 4. Mapear Idioma (MELHORIA: Extração de Código e Multi-seleção)
        if (Array.isArray(languagesAnswer) && languagesAnswer.length > 0) {
            filters.languages = languagesAnswer.map(fullLang => {
                // Regex para extrair o código de duas letras no início: 'pt (Português)' -> 'pt'
                const match = fullLang.match(/^(\w+)/);
                return match ? match[1] : null;
            }).filter(code => code !== null);
        } else {
            // Caso o idioma não seja respondido, pode-se definir um fallback como 'en' ou deixar vazio
            filters.languages = [];
        }


        // 5. Mapear Nota Mínima
        if (Array.isArray(minRatingAnswer) && minRatingAnswer.length > 0) {
            // Garante que o valor '5.0' seja convertido corretamente para 5
            filters.minRating = parseFloat(minRatingAnswer[0]);
        }

        return filters;
    }

    return { generateRecommendations }
}