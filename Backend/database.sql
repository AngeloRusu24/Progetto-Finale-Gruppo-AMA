mariadb -u root -proot1234 la_ricetta_perfetta << 'EOF'
INSERT INTO recipes (title, description, category, emoji, user_id) VALUES
('Spaghetti alla Carbonara', 'La vera carbonara romana, cremosa e saporita.', 'Primi', '🍝', 1),
('Tiramisù Classico', 'Il dolce italiano per eccellenza, semplice e goloso.', 'Dolci', '🍮', 1),
('Insalata Greca', 'Fresca e colorata, perfetta per l estate.', 'Antipasti', '🥗', 2),
('Salmone alla Griglia', 'Secondo leggero e saporito con erbe aromatiche.', 'Secondi', '🐟', 2),
('Pizza Margherita', 'La pizza classica napoletana con pomodoro e mozzarella.', 'Primi', '🍕', 3),
('Panna Cotta', 'Dessert cremoso con salsa ai frutti di bosco.', 'Dolci', '🍮', 3);

INSERT INTO ingredients (name, quantity, recipe_id) VALUES
('Spaghetti', '320g', 1),
('Guanciale', '150g', 1),
('Uova', '4', 1),
('Pecorino Romano', '100g', 1),
('Pepe nero', 'q.b.', 1),
('Savoiardi', '300g', 2),
('Mascarpone', '500g', 2),
('Uova', '4', 2),
('Caffè', '200ml', 2),
('Cacao amaro', 'q.b.', 2),
('Pomodorini', '200g', 3),
('Cetriolo', '1', 3),
('Feta', '150g', 3),
('Olive nere', '50g', 3),
('Olio d oliva', '3 cucchiai', 3),
('Salmone', '400g', 4),
('Limone', '1', 4),
('Rosmarino', 'q.b.', 4),
('Olio d oliva', '2 cucchiai', 4),
('Farina', '500g', 5),
('Pomodoro', '200g', 5),
('Mozzarella', '200g', 5),
('Lievito', '7g', 5),
('Panna fresca', '500ml', 6),
('Zucchero', '100g', 6),
('Gelatina', '8g', 6),
('Frutti di bosco', '150g', 6);

INSERT INTO reviews (comment, rating, user_id, recipe_id) VALUES
('Ricetta fantastica, l ho rifatta tre volte!', 5, 2, 1),
('Ottima, ma ho aggiunto un po piu di pepe.', 4, 3, 1),
('Il miglior tiramisu che abbia mai assaggiato!', 5, 2, 2),
('Fresca e leggera, perfetta per l estate.', 5, 1, 3),
('Buonissima, la rifaro sicuramente!', 4, 3, 3),
('Pizza perfetta, come in pizzeria!', 5, 1, 5),
('Salmone cotto alla perfezione.', 4, 1, 4);
EOF