import { Router } from "express"
import { ensureAuth } from "../middlewares/auth.js"
import { recommendationController } from "../modules/recommendations/recommendations.controller.js"

export const recommendationRouter = () => {
    const router = Router()
    const ctrl = recommendationController()

    router.get("/", ensureAuth, ctrl.getRecommendations)

    return router
}