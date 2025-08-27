import express from 'express';
const router = express.Router();


module.exports = app => {
    
    app.use('/reports', router);

    router.get('/costs', async (req, res, next) => {
        return;
    });

    router.get('/reccomendations', async (req, res, next) => {
        return;
    });
}