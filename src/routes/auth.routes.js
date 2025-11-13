import { Router } from "express"
import {  makeAuthController } from "../modules/auth/auth.controller.js"

export const authRouter = () => {
    const router = Router()
    const ctrl = makeAuthController()

    router.post('/session', ctrl.create)

    return router
}