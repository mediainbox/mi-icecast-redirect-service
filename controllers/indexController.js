const helpers = require('../helpers/helpers.js');
const redis_client = require('../cache/redis');

module.exports = {
    async root(req, res, next) {
        let streamkey = req.params.streamkey;
        if (!streamkey) {
            res.status(404).send({
                "error": "streamkey not found"
            });
        }
        let group = await helpers.getServers();
        let server = await group.find(item => item.status == 'online');
        if (!server) {
            res.status(503).send({
                "error": "Service Unavailable"
            });
        }
        try {
            let server_mounts = await helpers.checkServer(server.host, server.credentials.user, server.credentials.password);
            let mount = await server_mounts.find(item => item.mount == '/' + streamkey);
            if (mount) {
                res.redirect(302, mount.listenurl);
            } else {
                res.status(404).send({
                    "error": "streamkey not found"
                });
            }
        } catch (error) {
            res.status(500).send({
                "error": "Error on checking servers."
            });
        }
    },
    async setup(req, res) {
        await redis_client.del('MI_servers_groups');
        let json_object = req.body;
        // Valido datos de request
        if (!json_object.token || json_object.token != process.env.TOKEN ||
            !json_object.groups || json_object.groups.length == 0
        ) {
            res.status(401).send({
                "error": "access denied"
            });
        }
        try {
            await helpers.setGroups(json_object.groups);
            await helpers.init();
            res.status(200).send({
                "info": "updated info"
            })
        } catch (error) {
            res.status(500).send({
                "error": "error on redis store data"
            });
        }
    }
}