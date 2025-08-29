import express from 'express';
const router = express.Router();


export const reportsRouter = app => {
    
    app.use('/reports', router);

    router.get('/costs', async (req, res, next) => {
        return;
    });

    router.get('/reccomendations', async (req, res, next) => {
        return;
    });
}