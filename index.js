"use strict";

// Declaro constantes
const express = require('express'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    app = express(),
    cors = require('cors'),
    fs = require('fs');

const port = process.env.PORT;

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.options(cors());

const router = express.Router();
app.use('/', router);

require('./routes')(router);

const helpers = require('./helpers/helpers');
helpers.init();

// Mensaje Inicial
app.listen(port, '0.0.0.0', () => console.log(`Server running on -->> http://0.0.0.0:${port}`));