import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  comment: { type: String },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipe:  { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);