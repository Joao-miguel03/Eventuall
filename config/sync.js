const sequelize = require('./database');
const User = require('../models/User');
const Event = require('../models/Event');
const Category = require('../models/Category');

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // Use { force: true } para recriar tabelas (apaga tudo!)
    console.log('✅ Banco de dados sincronizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao sincronizar o banco de dados:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
