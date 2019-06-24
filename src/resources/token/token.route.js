import express from 'express';
import controller from './token.controller';

const router = express.Router();

router
  .route('/')
  .get(controller.getMany)
  .post(controller.createOne);

export default router;
