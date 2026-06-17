import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  quantity: { type: String },
  recipe:   { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
});

export default mongoose.model('Ingredient', ingredientSchema);