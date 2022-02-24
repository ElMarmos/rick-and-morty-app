import * as Joi from 'joi';

export default Joi.object({
  JWT_SECRET: Joi.string().required(),
  PORT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
});
