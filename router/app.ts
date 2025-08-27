import { start } from "repl";

const express = require('express');
const app = express();

const loaders = require('./loaders');

const { PORT } = require('./config');

async function startServer() {
    app.listen(PORT, () => {
        console.log(`Server listening on Port ${PORT}`)
    })
}

startServer