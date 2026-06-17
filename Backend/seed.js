// seed.js - Script per popolare il database con dati di prova
// Esegui con: node seed.js
// Il server backend deve essere avviato prima (npm run dev)

const BASE_URL = 'http://localhost:3000/api';

const users = [
  { username: 'mario_chef', email: 'mario@test.com', password: 'password123' },
  { username: 'giulia_cucina', email: 'giulia@test.com', password: 'password123' },
  { username: 'luca_food', email: 'luca@test.com', password: 'password123' },
];

const recipes = [
  {
    userIndex: 0,
    recipe: { title: 'Spaghetti alla Carbonara', description: 'La vera carbonara romana, cremosa e saporita senza panna.', category: 'Primi', emoji: '🍝' },
    ingredients: [
      { name: 'Spaghetti', quantity: '320g' },
      { name: 'Guanciale', quantity: '150g' },
      { name: 'Uova', quantity: '4' },
      { name: 'Pecorino Romano', quantity: '100g' },
      { name: 'Pepe nero', quantity: 'q.b.' },
    ]
  },
  {
    userIndex: 0,
    recipe: { title: 'Pizza Margherita', description: 'La pizza classica napoletana con pomodoro e mozzarella.', category: 'Primi', emoji: '🍕' },
    ingredients: [
      { name: 'Farina 00', quantity: '500g' },
      { name: 'Pomodoro pelato', quantity: '200g' },
      { name: 'Mozzarella', quantity: '200g' },
      { name: 'Lievito di birra', quantity: '7g' },
      { name: 'Olio d\'oliva', quantity: '2 cucchiai' },
    ]
  },
  {
    userIndex: 1,
    recipe: { title: 'Tiramisù Classico', description: 'Il dolce italiano per eccellenza, semplice e goloso.', category: 'Dolci', emoji: '🍮' },
    ingredients: [
      { name: 'Savoiardi', quantity: '300g' },
      { name: 'Mascarpone', quantity: '500g' },
      { name: 'Uova', quantity: '4' },
      { name: 'Caffè', quantity: '200ml' },
      { name: 'Cacao amaro', quantity: 'q.b.' },
    ]
  },
  {
    userIndex: 1,
    recipe: { title: 'Insalata Greca', description: 'Fresca e colorata, perfetta per l\'estate.', category: 'Antipasti', emoji: '🥗' },
    ingredients: [
      { name: 'Pomodorini', quantity: '200g' },
      { name: 'Cetriolo', quantity: '1' },
      { name: 'Feta', quantity: '150g' },
      { name: 'Olive nere', quantity: '50g' },
      { name: 'Olio d\'oliva', quantity: '3 cucchiai' },
    ]
  },
  {
    userIndex: 2,
    recipe: { title: 'Salmone alla Griglia', description: 'Secondo leggero e saporito con erbe aromatiche.', category: 'Secondi', emoji: '🐟' },
    ingredients: [
      { name: 'Salmone', quantity: '400g' },
      { name: 'Limone', quantity: '1' },
      { name: 'Rosmarino', quantity: 'q.b.' },
      { name: 'Olio d\'oliva', quantity: '2 cucchiai' },
    ]
  },
  {
    userIndex: 2,
    recipe: { title: 'Panna Cotta', description: 'Dessert cremoso con salsa ai frutti di bosco.', category: 'Dolci', emoji: '🍮' },
    ingredients: [
      { name: 'Panna fresca', quantity: '500ml' },
      { name: 'Zucchero', quantity: '100g' },
      { name: 'Gelatina', quantity: '8g' },
      { name: 'Frutti di bosco', quantity: '150g' },
    ]
  },
];

// recensioni: userIndex recensisce recipeIndex (non può recensire le proprie)
const reviews = [
  { userIndex: 1, recipeIndex: 0, comment: 'Ricetta fantastica, l\'ho rifatta tre volte!', rating: 5 },
  { userIndex: 2, recipeIndex: 0, comment: 'Ottima, ma ho aggiunto un po\' più di pepe.', rating: 4 },
  { userIndex: 0, recipeIndex: 2, comment: 'Il miglior tiramisù che abbia mai assaggiato!', rating: 5 },
  { userIndex: 2, recipeIndex: 3, comment: 'Fresca e leggera, perfetta per l\'estate.', rating: 5 },
  { userIndex: 0, recipeIndex: 3, comment: 'Buonissima, la rifarò sicuramente!', rating: 4 },
  { userIndex: 1, recipeIndex: 4, comment: 'Salmone cotto alla perfezione.', rating: 4 },
  { userIndex: 0, recipeIndex: 5, comment: 'Panna cotta deliziosa!', rating: 5 },
];

async function register(user) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return res.json();
}

async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return data.token;
}

async function createRecipe(token, recipe) {
  const res = await fetch(`${BASE_URL}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(recipe),
  });
  const data = await res.json();
  return data.insertId;
}

async function createIngredient(token, ingredient) {
  await fetch(`${BASE_URL}/ingredients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(ingredient),
  });
}

async function createReview(token, review) {
  const res = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(review),
  });
  return res.json();
}

async function seed() {
  console.log('🌱 Avvio seed...\n');

  // 1. Registra utenti
  const tokens = [];
  for (const user of users) {
    await register(user);
    const token = await login(user.email, user.password);
    tokens.push(token);
    console.log(`✅ Utente creato: ${user.username}`);
  }

  // 2. Crea ricette + ingredienti
  const recipeIds = [];
  for (const entry of recipes) {
    const token = tokens[entry.userIndex];
    const insertId = await createRecipe(token, entry.recipe);
    recipeIds.push(insertId);
    console.log(`🍽️  Ricetta creata: ${entry.recipe.title} (id: ${insertId})`);

    for (const ing of entry.ingredients) {
      await createIngredient(token, { ...ing, recipeId: insertId });
    }
    console.log(`   └─ ${entry.ingredients.length} ingredienti aggiunti`);
  }

  // 3. Crea recensioni
  for (const rev of reviews) {
    const token = tokens[rev.userIndex];
    const recipeId = recipeIds[rev.recipeIndex];
    const result = await createReview(token, {
      comment: rev.comment,
      rating: rev.rating,
      recipeId,
    });
    if (result.message === 'Recensione aggiunta con successo!') {
      console.log(`⭐ Recensione aggiunta per ricetta id ${recipeId}`);
    } else {
      console.log(`⚠️  Recensione saltata: ${result.message}`);
    }
  }

  console.log('\n✅ Seed completato!');
}

seed().catch(err => {
  console.error('❌ Errore durante il seed:', err.message);
  process.exit(1);
});