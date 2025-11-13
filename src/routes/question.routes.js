import { Router } from "express"
import { makeQuestionController } from "../modules/questions/question.controller.js"

export const questionRouter = () => {
    const router = Router()
    const ctrl = makeQuestionController()

    router.get("/", ctrl.getAllQuestions)

    return router
}