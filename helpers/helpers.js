const axios = require("axios"),
    xmlParser = require('xml2json'),
    redis_client = require('../cache/redis');

var intervals = [];
var servers_group = [];

module.exports = {
    async fetchIce(server) {
        let config = {
            method: 'get',
            url: server.host,
            responseType: 'application/xml'
        };
        if (server.credentials) {
            config["auth"] = {
                username: server.credentials.user,
                password: server.credentials.password
            };
        }
        try {
            let response = await axios(config);
            response = await xmlParser.toJson(response.data);
            response = JSON.parse(response);
            let sources = response.icestats.source;
            return sources;
        } catch (error) {
            return new Error(error);
        }
    },
    async fetchSM(server) {
        let config = {
            method: 'get',
            url: server.host,
            responseType: 'application/json'
        };
        if (server.credentials) {
            config["auth"] = {
                username: server.credentials.user,
                password: server.credentials.password
            };
        }
        try {
            let response = await axios(config);
            let sources = response.data;
            return sources;
        } catch (error) {
            console.log(error)
            return new Error(error);
        }
    },
    async checkServer(server) {
        let source;
        if (server.type && server.type === "sm") {
            source = await this.fetchSM(server)
            return source
        }
        source = await this.fetchIce(server)
        return source
    },
    async setGroups(groups) {
        try {
            await redis_client.set("MI_servers_groups", JSON.stringify(groups));
            return true;
        } catch (error) {
            return false;
        }
    },
    async setServer(server) {
        var that = this;
        try {
            return redis_client.get('MI_servers_groups', function (err, servers) {
                if (!err && servers !== null) {
                    let groups = JSON.parse(servers);
                    let server_status = groups.map(item => {
                        if (item.host == server.host && item.priority == server.priority) {
                            item.status = server.status;
                            return item;
                        } else {
                            return item;
                        }
                    });
                    that.setGroups(server_status);
                }
                return true;
            });
        } catch (error) {
            return false;
        }
    },
    init() {
        var that = this;
        // Comienzo intervalos de chequeo.
        let checkInfo = setInterval(() => {
            servers_group = [];
            redis_client.get('MI_servers_groups', function (err, servers) {
                if (!err && servers !== null) {
                    // Si encuentro info en redis paro intervalo de chequeo para buscar si existe key
                    clearInterval(checkInfo);
                    let groups = JSON.parse(servers);
                    // Seteo nuevos intervalos
                    let server_status = groups.map(server => {
                        return that.getStatus.call(that, server);
                    });
                    Promise.all(server_status).then(updatedInfo => {
                        if (!updatedInfo[0]) {
                            console.log("updatedInfo null", updatedInfo);
                            return false;
                        }
                        console.log('\n');
                        console.log('Updating status in redis');
                        that.setGroups(updatedInfo);
                        // Limpio intervalos
                        that.resetIntervals();
                        updatedInfo.forEach((server) => {
                            let tmp_interval = setInterval(function (item) {
                                // Me fijo cada server por separado y seteo intervalo de server
                                that.getStatus.call(that, item)
                                    .then(response => {
                                        that.setServer(response);
                                    })
                                    .catch(error => {
                                        that.setServer(error);
                                    });
                            }.bind(that, server), server.interval + "000");
                            intervals.push(tmp_interval);
                        });
                    });
                }
            });
        }, 3000);
    },
    async getStatus(server) {
        var that = this;
        let response = await that.checkServer(server);
        if (response instanceof Error) { 
            server.status = "offline";
            console.log('------------------------------------------');
            console.log(server.host, "status offline, priority: ", server.priority, " group: ", server.name);
            let index = await servers_group.findIndex(x => x.host == server.host && x.priority == server.servers_group);
            if (index > -1) {
                servers_group[index].status = server.status;
            } else {
                servers_group.push(server);
            }
            return server;
        }
        server["status"] = "online";
        console.log('------------------------------------------');
        console.log(server.host, "status online, priority: ", server.priority, " group: ", server.name);
        let index = await servers_group.findIndex(x => x.host == server.host && x.priority == server.servers_group);
        if (index > -1) {
            if (server.type === "sm") {
                servers_group[index].status = response.connected;
            } else {
                servers_group[index].status = response.status;
            }
        } else {
            servers_group.push(server);
        }
        return server;
    },
    resetIntervals() {
        console.log("resetIntervals");
        intervals.forEach(id => {
            clearInterval(id);
        });
    },
    getServers() {
        let sortedItems = servers_group.sort((a, b) => {
            return a.priority - b.priority
        });
        return sortedItems;
    }
};