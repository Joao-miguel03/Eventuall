const express = require("express");
const router = express.Router();
const { authenticate, authorizeRole } = require("../config/authMiddleware"); // Importando as funções
const categoryController = require("../controllers/categoryController");

// Rota para listar categorias
router.get("/", categoryController.listCategories);

// Rota para exibir formulário de criação de categoria
router.get("/create", authenticate, authorizeRole("admin"), (req, res) => res.render("registerCategory"));

// Rota para criar uma categoria (só administradores podem criar)
router.post("/create", authenticate, authorizeRole("admin"), categoryController.create);

// Rota para exibir detalhes de uma categoria
router.get("/:id", categoryController.showCategory);

// Rota para atualizar categoria (somente administradores)
router.post("/:id/edit", authenticate, authorizeRole("admin"), categoryController.update);

// Rota para deletar categoria (somente administradores)
router.post("/:id/delete", authenticate, authorizeRole("admin"), categoryController.delete);

module.exports = router;
