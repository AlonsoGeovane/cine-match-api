import { recommendationService } from "./recommendations.service.js";

export const recommendationController = () => {
    const service = recommendationService()

    const getRecommendations = async (request, response, next) => {
        try {
            const { sessionId } = request.session; // Obtido do JWT pelo authMiddleware
            
            const result = await service.generateRecommendations(sessionId);

            return response.json(result);
        } catch (error) {
            next(error);
        }
    }

    return { getRecommendations }
}