const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

// Charger les variables d'environnement
require('dotenv').config();
const HMAC_SECRET = process.env.HMAC_SECRET;

// Définir le schéma User
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Middleware pour hacher le mot de passe avant de sauvegarder l'utilisateur
UserSchema.pre('save', function(next) {
  if (this.isModified('password') || this.isNew) {
    this.password = crypto.createHmac('sha256', HMAC_SECRET)
                          .update(this.password)
                          .digest('hex');
  }
  next();
});

// Créer le modèle User à partir du schéma
const User = mongoose.model('User', UserSchema, 'users'); // 'users' est le nom de la collection

module.exports = User;

