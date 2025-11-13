export class HttpError extends Error {

    constructor(message = 'Unexpected error', status = 500, code = 'INTERNAL_ERROR', details = null) {

        super(message); this.status = status; this.code = code; this.details = details;

    }
}