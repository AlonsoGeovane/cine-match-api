import { makeAuthService } from "./auth.service.js"

export const makeAuthController = () => {
    const service = makeAuthService()

    const create = (_request, response, next) => {
        try {
            const { accessToken } = service.createSession();
            
            return response.status(201).json({ accessToken });
        } catch (error) {
            return next(error);
        }
    };

    return { create };
}