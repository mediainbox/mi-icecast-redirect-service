module.exports = (app) => {
    // Declaro controllers
    const index_controller = require('./controllers/indexController');

    // Endpoints aplicacion
    app.post('/setup', index_controller.setup);
    app.use('/group/:group/streamkey/:streamkey', index_controller.root);
};