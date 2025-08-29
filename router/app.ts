import { start } from "repl";

import express from 'express';
import { config } from './config';

const app = express();
const { PORT } = config;

async function startServer() {
    app.listen(PORT, () => {
        console.log(`Server listening on Port ${PORT}`)
    })
}

startServer();