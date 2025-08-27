import express from 'express'
const router = express.Router();


module.exports = (app, passport) => {

    app.use('/auth', router);

    router.post('/login', passport, async (req, res, next) => {
        return;
    });

    router.post('/logout', passport, async (req, res, next) => {
        return;
    });

}