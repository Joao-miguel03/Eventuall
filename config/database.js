const { Sequelize } = require('sequelize');
const path = require('path');

// Configuração do Sequelize para SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'), // Caminho do banco de dados SQLite
  logging: false, // Desativar logs no console
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('🔥 Conexão com o banco de dados estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
  }
}

testConnection();

module.exports = sequelize;
