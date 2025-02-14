const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const User = require('../models/User'); // Certifique-se de importar o modelo User

module.exports = (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Segurança: Protege contra vulnerabilidades comuns
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], 
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "https://cdn.jsdelivr.net"], 
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
      },
    },
  }));

  // CORS: Permite requisições de diferentes origens
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Logs: Mostra requisições no terminal
  app.use(morgan('dev'));

  // Configuração da sessão
  app.use(session({
    secret: "secreta",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  // Middleware para armazenar usuário logado
  app.use(async (req, res, next) => {
    res.locals.isLoggedIn = req.session.token ? true : false;
    res.locals.user = null; // Garante que user esteja sempre definido

    if (req.session.userId) {
      try {
        const user = await User.findByPk(req.session.userId, {
          attributes: ['id', 'name', 'role']
        });

        if (user) {
          res.locals.user = {
            id: user.id,
            name: user.name,
            role: user.role
          };
        }
      } catch (error) {
        console.error("Erro ao buscar usuário na sessão:", error);
      }
    }

    next();
  });

  app.use((req, res, next) => {
    console.log("Sessão atual:", req.session);
    next();
  });

  console.log("Middlewares configurados!");
};
