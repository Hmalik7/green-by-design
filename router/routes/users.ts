import express from 'express';
const router = express.Router();


module.exports = app => {

    app.use('/users', router);

    router.get('/', async (req, res, next) => {
        return;
    });

    router.get('/:userId', async (req, res, next) => {
        return;
    });

    router.put('/:userId', async (req, res, next) => {
        return;
    });

    router.delete('/:userId', async (req, res, next) => {
        return;
    });

    router.get('/:userId/services', async (req, res, next) => {
        return;
    });

    router.post('/:userId/services/:serviceId', async (req, res, next) => {
        return;
    });

    router.delete('/:userId/services/serviceId', async (req, res, next) => {
        return;
    });

    router.get('/:id/privileges', async (req, res, next) => {
        return;
    });
}
