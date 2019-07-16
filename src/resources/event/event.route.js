import express from 'express';
import controller from './event.controller';

const router = express.Router();

router
  .route('/')
  .get(controller.getAll)
  .post(controller.findByDateRange)
  .put(controller.findAndUpdateEvent);

router.route('/events/:id').delete(controller.removeOne);
router.route('/create').post(controller.createOne);

export default router;
