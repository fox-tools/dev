import express from 'express'
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from '../../docs/swaggerDef.js'

const router = express.Router()

// const specs = swaggerJsdoc({
//   swaggerDefinition,
//   apis: ['commands/docs/*.yml', 'commands/routes/v1/*.js'],
// });

// router.use('/', swaggerUi.serve);
// router.get(
//   '/',
//   swaggerUi.setup(specs, {
//     explorer: true,
//   })
// );

export default router
