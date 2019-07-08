module.exports = (app) => {
    // Declaro controllers
    const index_controller = require('./controllers/indexController');

    // Endpoints aplicacion
    app.post('/setup', index_controller.setup);
    app.use('/streamkey/:streamkey', index_controller.root);
};