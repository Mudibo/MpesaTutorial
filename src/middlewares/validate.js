export function validate(schema, property = "body") {
    return async (req, res, next) => {
        try {
            req[property] =
                await schema.parseAsync(req[property]);
            next();
        } catch (error) {
            next(error);
        }
    };
}