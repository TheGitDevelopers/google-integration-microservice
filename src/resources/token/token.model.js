import mongoose from 'mongoose';

const tokenSchema = mongoose.Schema({
  tokenID: String,
});

export default mongoose.model('Token', tokenSchema);
