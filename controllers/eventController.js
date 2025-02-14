const  Category  = require("../models/Category");
const  Event  = require("../models/Event");
const  User  = require("../models/User");

const eventController = {
  // Criar evento
  async create(req, res) {
    try {
      const { title, description, date, location, isPrivate, category} = req.body;
      const userId = req.user.id; // O usuário autenticado está em req.user

      const event = await Event.create({
        title,
        description,
        date,
        location,
        isPrivate,
        createdBy: userId,
        category: category,
      });
      
      return res.redirect("/events")
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Erro ao criar evento", details: error.message });
    }
  },

  async createPublicEvent(req, res) {
    // Lógica para criar um evento público
    try {
      const { title, description, date, location, isPrivate } = req.body;
      const userId = req.user.id; // O usuário autenticado está em req.user

      const event = await Event.create({
        title,
        description,
        date,
        location,
        isPrivate: false, // Defina como público
        createdBy: userId,
      });

      return res.status(201).json({ message: "Evento público criado com sucesso!", event });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Erro ao criar evento", details: error.message });
    }
  },

  async renderForm(req, res){
    try{
      const categories = await Category.findAll();
      const categoriesData = categories.map(categories => categories.get( {plain: true} ));

      res.render("registerEvent", { categories : categoriesData});
    }catch(erro){
      console.error("Erro ao enviar categorias para o formulario"); 
    }
  },

  // Listar eventos
  async listEvents(req, res) {
    try {
      const events = await Event.findAll();
      const users = await User.findAll();
      const categories = await Category.findAll();
      const eventsData = events.map(events => events.get( {plain: true} ));
      const usersData = users.map(users => users.get( {plain: true} ));
      const categoriesData = categories.map(categories => categories.get({ plain: true }));

      res.render("indexEvent", {events : eventsData, users: usersData, categories: categoriesData, user: req.user,});

    } catch (error) {
      console.error("Erro ao listar eventos:", error); 
        res.status(500).render('indexEvent', { error: 'Erro ao carregar a lista de eventos.' });
    }
  },

  // Buscar evento por ID
  async show(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id);
      const eventData = event.get({ plain:true });

      return res.render("detailsEvent", {event: eventData});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar evento", details: error.message });
    }
  },

  // Atualizar evento
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, date, location, isPrivate } = req.body;
      const event = await Event.findByPk(id);

      if (!event) {
        return res.status(404).json({ error: "Evento não encontrado" });
      }

      await event.update({ title, description, date, location, isPrivate });

      return res.redirect("/events");

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao atualizar evento", details: error.message });
    }
  },

  // Deletar evento
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id; // ID do usuário logado
      const userRole = req.user.role; // Papel do usuário logado
  
      console.log("Usuário logado:", req.user); // Adicione para depurar o conteúdo de req.user
  
      const event = await Event.findByPk(id);
  
      if (!event) {
        return res.status(404).json({ error: "Evento não encontrado" });
      }
  
      // Verifica se o usuário é o admin ou o criador do evento
      if (userRole === 'admin' || event.createdBy === userId) {
        await event.destroy();
        return res.redirect("/events");
      }
  
      return res.status(403).json({ error: "Você não tem permissão para excluir este evento" });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao excluir evento", details: error.message });
    }
  }
  
};

module.exports = eventController;
