import * as Joi from 'joi';

export default {
    validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        API_PORT: Joi.number().default(3000),
        API_HOST: Joi.string().default('localhost'),
        POSTGRES_HOST: Joi.string().default('postgres'),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_USER: Joi.string().default('root'),
        POSTGRES_PASSWORD: Joi.string().default('root'),
        POSTGRES_DB: Joi.string().default('root'),
        JWT_ACCESS_SECRET: Joi.string().default('root'),
        JWT_ACCESS_EXPIRATION: Joi.string().default('root'),
    }),
    validationOptions: {
        allowUnknown: true,
        abortEarly: true,
    }
}
