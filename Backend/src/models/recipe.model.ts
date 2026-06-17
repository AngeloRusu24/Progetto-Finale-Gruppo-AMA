import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  category:    { type: String },
  emoji:       { type: String },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Recipe', recipeSchema);