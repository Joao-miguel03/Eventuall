const express = require('express');
const configureMiddleware = require('./config/middleware');
const configureHandlebars = require('./config/handlebars');

const app = express();
app.use(express.static(__dirname + '/public'));

// Configurar middlewares
configureMiddleware(app);

// Configurar Handlebars
configureHandlebars(app);

// Importar Rotas e Definir Rotas
const categoryRoutes = require('./routes/categoryRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

// Iniciar Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
