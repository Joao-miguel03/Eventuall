const exphbs = require('express-handlebars');

module.exports = (app) => {
    app.engine('hbs', exphbs.engine({
        extname: 'hbs',
        defaultLayout: 'main',
        layoutsDir: __dirname + '/../views/layouts',  // Diretório de layouts
        partialsDir: __dirname + '/../views/partials', // Diretório de partials
        helpers: {
            eq: function (a, b) {
              return a === b;
            }
          }
    }));
    app.set('view engine', 'hbs');
    app.set('views', __dirname + '/../views');
};
