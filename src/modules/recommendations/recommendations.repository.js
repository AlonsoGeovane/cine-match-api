import { Op } from "sequelize";
import { Movie } from "../../models/Movie.js";

const { literal } = Movie.sequelize;

export const makeRecommendationRepoSequelize = () => {

    const findMoviesByFilters = async (filters) => {
        const where = {};
        const order = [];
        const conditions = [];

        // -----------------------------
        // Funções Auxiliares
        // -----------------------------

        const createLikeCondition = (genre) => ({
            genre: { 
                [Op.like]: `%${genre}%`
            }
        });

        const extractGenres = (movie) => {
            if (!movie.genre) return [];
            return movie.genre.split(",").map(g => g.trim());
        };

        // -----------------------------
        // 1. Preferred Genres (obrigatório)
        // -----------------------------
        if (Array.isArray(filters.preferredGenres) && filters.preferredGenres.length > 0) {
            const preferredConditions = filters.preferredGenres.map(createLikeCondition);
            conditions.push({ [Op.or]: preferredConditions });
        }

        // -----------------------------
        // 2. Avoid genres (remover filmes com esses gêneros)
        // -----------------------------
        if (Array.isArray(filters.avoidGenres) && filters.avoidGenres.length > 0) {
            const avoidConditions = filters.avoidGenres.map(genre => ({
                genre: { [Op.notLike]: `%${genre}%` }
            }));
            conditions.push(...avoidConditions);
        }

        if (conditions.length > 0) {
            where[Op.and] = conditions;
        }

        // -----------------------------
        // 3. Languages
        // -----------------------------
        if (Array.isArray(filters.languages) && filters.languages.length > 0) {
            where.originalLanguage = { [Op.in]: filters.languages };
        }

        // -----------------------------
        // 4. Min Rating
        // -----------------------------
        if (typeof filters.minRating === "number") {
            where.voteAverage = { [Op.gte]: filters.minRating };
        }

        // -----------------------------
        // 5. Order (random + rating)
        // -----------------------------
        order.push(["voteAverage", "DESC"]);
        order.push([literal("RANDOM()")]);

        const LIMIT = 20; // pegar mais resultados para um cálculo de afinidade melhor

        const movies = await Movie.findAll({
            where,
            order,
            limit: LIMIT
        });

        let results = movies.map(m => m.toJSON());

        // -----------------------------
        // 6. Cálculo de AFINIDADE
        // -----------------------------

        const WEIGHTS = {
            preferred: 50,
            mood: 25,
            language: 15,
            rating: 10
        };

        const computeAffinity = (movie) => {
            const movieGenres = extractGenres(movie);
            let score = 0;

            // Preferred genres
            if (filters.preferredGenres.length > 0) {
                const matches = movieGenres.filter(g => filters.preferredGenres.includes(g)).length;
                const total = filters.preferredGenres.length;
                score += (matches / total) * WEIGHTS.preferred;
            }

            // Mood boost
            if (filters.moodBoostGenres.length > 0) {
                const matches = movieGenres.filter(g => filters.moodBoostGenres.includes(g)).length;
                const total = filters.moodBoostGenres.length;
                score += (matches / total) * WEIGHTS.mood;
            }

            // Language
            if (filters.languages.length > 0) {
                if (filters.languages.includes(movie.originalLanguage)) {
                    score += WEIGHTS.language;
                }
            }

            // Rating
            if (movie.voteAverage >= filters.minRating) {
                score += WEIGHTS.rating;
            }

            return Math.round(score);
        };

        // Aplicar afinidade
        results = results.map(movie => ({
            ...movie,
            affinity: computeAffinity(movie)
        }));

        // Ordenar por afinidade desc
        results.sort((a, b) => b.affinity - a.affinity);

        return results;
    };

    return { findMoviesByFilters };
};
