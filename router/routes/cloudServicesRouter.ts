import express from 'express';
const router = express.Router();


export const cloudServiceRouter = app => {

    app.use('/cloud-services', router);

    router.get('/', async (req, res, next) => {
        return;
    });

    router.put('/', async (req, res, next) => {
        return;
    });

    router.get('/:id', async (req, res, next) => {
        return;
    });

    router.put('/:id', async (req, res, next) => {
        return;
    });

    router.delete('/:id', async (req, res, next) => {
        return;
    });

    router.get('/:id/usage', async (req, res, next) => {
        return;
    });
}