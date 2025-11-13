// Uso: validate({ body: z.object(...), query: z.object(...), params: z.object(...) })
export const validate = (schemas = {}) => (req, _res, next) => {

    try {

        if (schemas.body) req.body = schemas.body.parse(req.body);
        if (schemas.query) req.query = schemas.query.parse(req.query);
        if (schemas.params) req.params = schemas.params.parse(req.params);
        return next();

    } catch (err) {

        const issues = err?.issues?.map(i => ({
            path: i.path, message: i.message
        })) ?? null;

        return next({ message: 'Validation error', status: 400, code: 'BAD_REQUEST', details: issues });

    }
};