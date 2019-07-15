module.exports = (app) => {
    // Declaro controllers
    const index_controller = require('./controllers/indexController');

    // Endpoints aplicacion
    /**
     * @api {post} /setup Setup Group Servers
     * @apiVersion 1.0.0
     * @apiName mi-icecast-redirect
     * @apiGroup Servers
     * @apiExample {json} Example usage:
     * {
     * 	"token": "token",
     * 	"groups": [
     * 		{
     * 			"name": "mi-01",
     * 			"priority": 1,
     * 			"host": "url",
     * 			"status": "online",
     * 			"interval": 60,
     *          "listenerHost": "host",
     * 			"credentials": {
     * 			   "user": "user",
     * 			   "password": "password"
     * 			}
     * 		},
     * 		{
     * 			"name": "mi-01",
     * 			"priority": 2,
     * 			"host": "url",
     * 			"status": "online",
     * 			"interval": 60,
     *          "listenerHost": "host",
     * 			"credentials": {
     * 			   "user": "user",
     * 			   "password": "password"
     * 			}
     * 		},
     * 		{
     * 			"name": "mi-02",
     * 			"priority": 1,
     * 			"host": "url",
     * 			"status": "online",
     * 			"interval": 60,
     *          "listenerHost": "host",
     * 			"credentials": {
     * 			   "user": "user",
     * 			   "password": "password"
     * 			}
     * 		}
     * 	]
     * }
     * @apiSuccessExample {json} Success response:
     *     HTTPS 201 OK
     *     {
     *      "info": "updated info"
     *     }
     */
    app.post('/setup', index_controller.setup);
    /**
     * @api {put} /:protocol/:port/:group/:streamkey Redirect
     * @apiVersion 1.0.0
     * @apiName mi-icecast-redirect
     * @apiGroup redirect
     * @apiPermission public
     */
    app.use('/:protocol/:port/:group/:streamkey', index_controller.root);
};