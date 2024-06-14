const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user'); 

const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/myapp?socketTimeoutMS=1000', { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000, // 30 seconds 
  socketTimeoutMS: 45000, // 45 seconds 
  })
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.log(err));

// Configurer Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route de base
app.get('/', (req, res) => {
  res.render('index', { title: 'Mon application' });
});

// Utiliser les routes des utilisateurs
app.use('/api/users', userRoutes);

// Route vers le tableau de bord (à définir)
app.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

// Route pour le formulaire d'inscription
app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
  });

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
