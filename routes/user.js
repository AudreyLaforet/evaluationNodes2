


const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');

// Route pour afficher le formulaire d'inscription
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// Route pour créer un nouvel utilisateur avec validations et vérification d'existence
router.post('/register', [
  body('firstName').not().isEmpty().withMessage('First Name is required'),
  body('lastName').not().isEmpty().withMessage('Last Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('register', { 
      title: 'Register',
      errors: errors.array()
    });
  }
  
  const { firstName, lastName, email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email }).maxTimeMS(60000);
    if (existingUser) {
      return res.status(400).render('register', {
        title: 'Register',
        errors: [{ msg: 'User already exists with this email' }]
      });
    }

    // Créer un nouvel utilisateur s'il n'existe pas
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();
    res.status(201).redirect('/'); // Redirection vers la page d'accueil après l'enregistrement réussi
  } catch (err) {
    console.log(err);

    res.status(500).render('register', {
      title: 'Register',
      errors: [{ msg: 'Error occurred while creating the user' }]
     
    });

    
  }
});
// Route pour afficher le formulaire de login
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
  });
  
  // Route pour gérer la connexion de l'utilisateur
  router.post('/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('login', { 
        title: 'Login',
        errors: errors.array()
      });
    }
    
    const { email, password } = req.body;
  
    try {
      // Vérifier les informations d'identification de l'utilisateur
      const user = await User.findOne({ email, password });
      if (!user) {
        return res.status(401).render('login', {
          title: 'Login',
          errors: [{ msg: 'Invalid credentials' }]
        });
      }
  
      // Redirection vers le tableau de bord si l'utilisateur est authentifié avec succès
      res.redirect('/dashboard');
    } catch (err) {
      res.status(500).render('login', {
        title: 'Login',
        errors: [{ msg: 'Error occurred while logging in' }]
      });
    }
  });
module.exports = router;