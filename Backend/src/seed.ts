import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/user.model';
import Recipe from './models/recipe.model';
import Ingredient from './models/ingredient.model';
import Review from './models/review.model';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connesso a MongoDB!');

  // pulizia database
  await User.deleteMany({});
  await Recipe.deleteMany({});
  await Ingredient.deleteMany({});
  await Review.deleteMany({});
  console.log('Database pulito!');

  // utenti
  const password = await bcrypt.hash('password123', 10);
  const [mario, sofia, luca] = await User.insertMany([
    { username: 'Mario Rossi', email: 'mario@test.com', password },
    { username: 'Sofia Bianchi', email: 'sofia@test.com', password },
    { username: 'Luca Ferrari', email: 'luca@test.com', password },
  ]);
  console.log('Utenti creati!');

  // ricette
  const [carbonara, tiramisu, insalata, salmone, pizza, pannaCotta] = await Recipe.insertMany([
    { title: 'Spaghetti alla Carbonara', description: 'La vera carbonara romana, cremosa e saporita.', category: 'Primi', emoji: '🍝', user: mario._id },
    { title: 'Tiramisù Classico', description: 'Il dolce italiano per eccellenza, semplice e goloso.', category: 'Dolci', emoji: '🍮', user: mario._id },
    { title: 'Insalata Greca', description: 'Fresca e colorata, perfetta per l estate.', category: 'Antipasti', emoji: '🥗', user: sofia._id },
    { title: 'Salmone alla Griglia', description: 'Secondo leggero e saporito con erbe aromatiche.', category: 'Secondi', emoji: '🐟', user: sofia._id },
    { title: 'Pizza Margherita', description: 'La pizza classica napoletana con pomodoro e mozzarella.', category: 'Primi', emoji: '🍕', user: luca._id },
    { title: 'Panna Cotta', description: 'Dessert cremoso con salsa ai frutti di bosco.', category: 'Dolci', emoji: '🍮', user: luca._id },
  ]);
  console.log('Ricette create!');

  // ingredienti
  await Ingredient.insertMany([
    { name: 'Spaghetti', quantity: '320g', recipe: carbonara._id },
    { name: 'Guanciale', quantity: '150g', recipe: carbonara._id },
    { name: 'Uova', quantity: '4', recipe: carbonara._id },
    { name: 'Pecorino Romano', quantity: '100g', recipe: carbonara._id },
    { name: 'Pepe nero', quantity: 'q.b.', recipe: carbonara._id },
    { name: 'Savoiardi', quantity: '300g', recipe: tiramisu._id },
    { name: 'Mascarpone', quantity: '500g', recipe: tiramisu._id },
    { name: 'Uova', quantity: '4', recipe: tiramisu._id },
    { name: 'Caffè', quantity: '200ml', recipe: tiramisu._id },
    { name: 'Cacao amaro', quantity: 'q.b.', recipe: tiramisu._id },
    { name: 'Pomodorini', quantity: '200g', recipe: insalata._id },
    { name: 'Cetriolo', quantity: '1', recipe: insalata._id },
    { name: 'Feta', quantity: '150g', recipe: insalata._id },
    { name: 'Olive nere', quantity: '50g', recipe: insalata._id },
    { name: 'Olio d oliva', quantity: '3 cucchiai', recipe: insalata._id },
    { name: 'Salmone', quantity: '400g', recipe: salmone._id },
    { name: 'Limone', quantity: '1', recipe: salmone._id },
    { name: 'Rosmarino', quantity: 'q.b.', recipe: salmone._id },
    { name: 'Olio d oliva', quantity: '2 cucchiai', recipe: salmone._id },
    { name: 'Farina', quantity: '500g', recipe: pizza._id },
    { name: 'Pomodoro', quantity: '200g', recipe: pizza._id },
    { name: 'Mozzarella', quantity: '200g', recipe: pizza._id },
    { name: 'Lievito', quantity: '7g', recipe: pizza._id },
    { name: 'Panna fresca', quantity: '500ml', recipe: pannaCotta._id },
    { name: 'Zucchero', quantity: '100g', recipe: pannaCotta._id },
    { name: 'Gelatina', quantity: '8g', recipe: pannaCotta._id },
    { name: 'Frutti di bosco', quantity: '150g', recipe: pannaCotta._id },
  ]);
  console.log('Ingredienti creati!');

  // recensioni
  await Review.insertMany([
    { comment: 'Ricetta fantastica, l ho rifatta tre volte!', rating: 5, user: sofia._id, recipe: carbonara._id },
    { comment: 'Ottima, ma ho aggiunto un po piu di pepe.', rating: 4, user: luca._id, recipe: carbonara._id },
    { comment: 'Il miglior tiramisu che abbia mai assaggiato!', rating: 5, user: sofia._id, recipe: tiramisu._id },
    { comment: 'Fresca e leggera, perfetta per l estate.', rating: 5, user: mario._id, recipe: insalata._id },
    { comment: 'Buonissima, la rifaro sicuramente!', rating: 4, user: luca._id, recipe: insalata._id },
    { comment: 'Pizza perfetta, come in pizzeria!', rating: 5, user: mario._id, recipe: pizza._id },
    { comment: 'Salmone cotto alla perfezione.', rating: 4, user: mario._id, recipe: salmone._id },
  ]);
  console.log('Recensioni create!');

  console.log('✅ Seed completato!');
  process.exit(0);
};

seed().catch(err => {
  console.error('Errore seed:', err);
  process.exit(1);
});