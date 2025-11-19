/**
 * src/routes/betaRoutes.js
 *
 * Rotas relacionadas ao acesso beta:
 * - GET  /beta-login   -> exibe formulário
 * - POST /beta-access  -> processa senha
 * - GET  /beta-logout  -> remove acesso
 *
 * Essas rotas devem ser registradas ANTES do betaAccessMiddleware.
 */

const express = require('express');
const router = express.Router();
const betaController = require('../controllers/betaController');

// Página de login beta (acesso)
router.get('/beta-login', betaController.renderBetaLogin);

// Processar senha (login beta)
router.post('/beta-access', betaController.processBetaAccess);

// Logout beta
router.get('/beta-logout', betaController.betaLogout);

module.exports = router;

