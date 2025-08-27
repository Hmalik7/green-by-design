import express from 'express';
const router = express.Router();


module.exports = app => {
    
    app.use('/roles', router);

    router.get('/', async (req, res, next) => {
        return;
    });

    router.post('/', async (req, res, next) => {
        return;
    });

    router.put('/:id', async (req, res, next) => {
        return;
    });
}