import { Router } from "express"
import { ensureAuth } from "../middlewares/auth.js"
import { validate } from "../middlewares/validate.js"
import { makeAnswerController } from "../modules/answers/answer.controller.js"
import { answerSchemas } from "../modules/answers/answer.schema.js"

export const answerRouter = () => {
    const router = Router()
    const ctrl = makeAnswerController()

    router.use(ensureAuth)

    router.post("/", validate({ body: answerSchemas.createOrUpdate }), ctrl.createOrUpdate)

    return router
}