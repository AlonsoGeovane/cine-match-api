import { Op } from "sequelize";
import { Movie } from "../../models/Movie.js"; 

const { literal } = Movie.sequelize; 

export const makeRecommendationRepoSequelize = () => {
    const findMoviesByFilters = async (filters) => {
        const where = {};
        const order = [];
        
        const conditions = [];

        // Função auxiliar para gerar a condição LIKE
        const createLikeCondition = (genre) => ({
            genre: {
                // Busca o gênero cercado por vírgulas ou no início/fim da string.
                // Ex: Busca por 'Ação' deve retornar 'Ação,Drama' e 'Drama,Ação'
                [Op.like]: `%${genre}%` 
            }
        });

        // 1. GÊNEROS PREFERIDOS (Filtro Obrigatório)
        if (Array.isArray(filters.preferredGenres) && filters.preferredGenres.length > 0) {
            // Usa Op.or: O filme deve conter PELO MENOS UM dos gêneros preferidos.
            const preferredConditions = filters.preferredGenres.map(createLikeCondition);
            conditions.push({ [Op.or]: preferredConditions });
        }
        
        // 2. GÊNEROS A EVITAR (Filtro Excludente)
        if (Array.isArray(filters.avoidGenres) && filters.avoidGenres.length > 0) {
            // Usa Op.and de NOT LIKE: O filme NÃO deve conter NENHUM dos gêneros a evitar.
            const avoidConditions = filters.avoidGenres.map(genre => ({
                genre: {
                    [Op.notLike]: `%${genre}%` 
                }
            }));
            conditions.push(...avoidConditions);
        }
        
        // Aplica todas as condições de gênero combinadas por AND
        if (conditions.length > 0) {
            where[Op.and] = conditions;
        }

        // 3. IDIOMA (Não alterado)
        if (Array.isArray(filters.languages) && filters.languages.length > 0) {
            where.originalLanguage = {
                [Op.in]: filters.languages
            };
        }

        // 4. NOTA MÍNIMA (Não alterado)
        if (typeof filters.minRating === 'number' && filters.minRating >= 0) {
            where.voteAverage = {
                [Op.gte]: filters.minRating
            };
        }

        // 5. ORDENAÇÃO (Não alterado)
        order.push(['voteAverage', 'DESC']); 
        order.push([literal('RANDOM()')]); 
        
        const LIMIT = 10; 

        const movies = await Movie.findAll({
            where,
            order,
            limit: LIMIT
        });

        // 6. PÓS-PROCESSAMENTO: Reforço de Humor (Mood Boost)
        let results = movies.map(movie => movie.toJSON());
        
        if (Array.isArray(filters.moodBoostGenres) && filters.moodBoostGenres.length > 0) {
            
            // Função auxiliar para converter a string CSV-like em array e calcular a pontuação
            const getScore = (movie) => {
                let movieGenres = [];
                
                // 💡 CORREÇÃO CRÍTICA: Converte a string delimitada por vírgula em um array, 
                // removendo espaços em branco extras.
                if (typeof movie.genre === 'string' && movie.genre.length > 0) {
                    movieGenres = movie.genre.split(',').map(g => g.trim());
                }

                // Garante que o array de gêneros está pronto para o cálculo
                return filters.moodBoostGenres.filter(g => movieGenres.includes(g)).length;
            }

            results.sort((a, b) => {
                const scoreA = getScore(a);
                const scoreB = getScore(b);
                
                return scoreB - scoreA; 
            });
        }
        
        return results;
    }

    return { findMoviesByFilters }
}