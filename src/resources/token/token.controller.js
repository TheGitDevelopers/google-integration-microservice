import Token from './token.model';
import logger from '../../tools/logger';

const getMany = (req, res) => {
  Token.find({})
    .exec()
    .then(token => res.status(200).json({
      token,
    }))
    .catch((error) => {
      logger.loggerError.error(error);
      res.status(500).json({
        error,
      });
    });
};

const createOne = (req, res) => {
  const token = new Token({
    tokenID: req.body.tokenID,
  });
  token
    .save()
    .then((t) => {
      if (t) {
        logger.loggerInfo.info(`new token: ${t}`);
        return res.status(201).json({
          message: 'success',
        });
      }
      logger.loggerError.error('Something went wrong');
      return null;
    })
    .catch((error) => {
      logger.loggerError.error(error);
      return res.status(500).json({
        error,
      });
    });
};

export default {
  getMany,
  createOne,
};
