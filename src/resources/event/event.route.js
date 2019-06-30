import express from 'express';
import controller from './event.controller';

const router = express.Router();

router
  .route('/')
  .get(controller.getAll)
  .post(controller.findByDateRange)
  .put(controller.findAndUpdateOne);

router.route('/events/:id').delete(controller.removeOne);

export default router;
