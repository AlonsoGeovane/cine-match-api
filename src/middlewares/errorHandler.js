export const errorHandler = (err, _req, res, _next) => {

    const status = err?.status ?? 500;

    const payload = {

        message: err?.message ?? 'Internal server error',
        code: err?.code ?? 'INTERNAL_ERROR',
        details: err?.details ?? null

    };

    return res.status(status).json(payload);

};