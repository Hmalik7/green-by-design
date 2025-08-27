const authRouter = require('./auth');
const cloudServiceRouter = require('./cloud-services');
const reportsRouter = require('./reports');
const rolesRouter = require('./roles');
const usersRouter = require('./users');

module.exports = (app, passport) => {
    authRouter(app, passport),
    cloudServiceRouter(app),
    reportsRouter(app),
    rolesRouter(app),
    usersRouter(app)
}