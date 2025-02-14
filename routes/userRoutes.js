const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorizeRole } = require("../config/authMiddleware"); // Importando as funções

// Rota para registrar um usuário
router.get('/register', (req,res)=>{
    res.render('registerUser');
});
router.post('/register', userController.register);

// Rota para fazer login
router.get('/login', (req, res) => {
    res.render('login');  // Renderiza o arquivo login.hbs
});
router.post('/login', userController.login);

// Rota para listar todos os usuários
router.get('/', userController.listUsers);

// Rota para mostrar detalhes de um usuário
router.get('/:id', userController.showUser);

// Rota para atualizar um usuário
router.post('/:id/edit', userController.update);

// Rota para deletar um usuário
router.post('/:id/delete', userController.delete);

// Rota para o perfil do usuário
router.get('/profile/:id', userController.profile);

// Rota para deslogar
router.post('/logout', userController.logout);

module.exports = router;