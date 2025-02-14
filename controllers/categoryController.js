const Category = require("../models/Category");
const { authenticate, authorizeRole } = require('../config/authMiddleware');


const categoryController = {
  // Listar todas as categorias
  async listCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.render("indexCategory", { categories: categories.map(cat => cat.get({ plain: true })) });
    } catch (error) {
      console.error("Erro ao listar categorias:", error);
      res.status(500).render("indexCategory", { error: "Erro ao carregar categorias." });
    }
  },

  // Criar nova categoria
  async create(req, res) {
    try {
      // verificar se o usuario é administrador
      if (req.user.role !='admin'){
        return res.status(403).json({error: "Somente administradores podem criar categorias!"})
      }

      const { nome, description, icon, color, age_restriction } = req.body;
      await Category.create({ nome, description, icon, color, age_restriction });
      res.redirect("/categories");
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      res.status(500).send("Erro ao criar categoria");
    }
  },

  // Mostrar detalhes de uma categoria
  async showCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) return res.status(404).send("Categoria não encontrada");
      res.render("detailsCategory", { category: category.get({ plain: true }) });
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao buscar categoria");
    }
  },

  // Atualizar categoria
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, description, icon, color, age_restriction } = req.body;
      const category = await Category.findByPk(id);
      if (!category) return res.status(404).send("Categoria não encontrada");
      await category.update({ nome, description, icon, color, age_restriction });
      res.redirect(`/categories/${id}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao atualizar categoria");
    }
  },

  // Deletar categoria
  async delete(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) return res.status(404).send("Categoria não encontrada");
      await category.destroy();
      res.redirect("/categories");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao deletar categoria");
    }
  }
};

module.exports = categoryController;
