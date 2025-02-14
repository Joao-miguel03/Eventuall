const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const userController = {
  // Cadastro de usuário
  async register(req, res) {
    const { name, email, password, role } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });
  
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao criar usuário");
    }
  },

  async login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: "Usuário não encontrado!" });
        }

        // Gerar o token JWT
        const token = jwt.sign({ id: user.id, role: user.role }, 'secreta', { expiresIn: '1h' });

        // Armazenar token e userId na sessão
        req.session.token = token;
        req.session.userId = user.id; // <-- Certifique-se de armazenar o ID do usuário

        console.log("Usuário logado:", user.id); 

        res.redirect('/');  
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao realizar login" });
    }
  },

  // Listar todos os usuários
  async listUsers(req, res) {
    try {
        const users = await User.findAll();
        const usersData = users.map(user => user.get({ plain: true }));
        console.log(usersData);
        res.render('indexUser', { users: usersData });
    } catch (error) {
        console.error("Erro ao listar usuários:", error); 
        res.status(500).render('indexUser', { error: 'Erro ao carregar a lista de usuários.' });
    }
},

  // Mostrar detalhes de um usuário
  async showUser(req, res) {
    try {
      const {id} = req.params;
      const user = await User.findByPk(id);
  
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const userPlain = user.get({ plain: true });
      res.render('detailsUser', { user: userPlain });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  }
  ,

// Atualizar usuário
async update(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    await user.update({ name, email, password, role });

    res.redirect(`/users/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
}
,

  // Deletar usuário
  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Deleta o usuário
      await user.destroy();
      res.redirect('/users');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao remover usuário" });
    }
  },


  // Rota para o perfil do usuário
  async profile(req, res) {
    try {
      const userId = req.params.id; 

      const user = await User.findByPk(userId);

      const userData =  user.get({ plain: true });;

      console.log("Usuário encontrado:", user);
      
      res.render('profile', { user: userData });

    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      res.status(500).json({ error: "Erro ao carregar perfil" });
    }
},

  // Rota para logout
  async logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erro ao deslogar');
        }
        res.redirect('/');
    });
  }

};

module.exports = userController;