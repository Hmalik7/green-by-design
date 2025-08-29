const authRouter = require('./authRouter');
const cloudServiceRouter = require('./cloud-servicesRouter');
const reportsRouter = require('./reportsRouter');
const rolesRouter = require('./rolesRouter');
const usersRouter = require('./usersRouter');

module.exports = (app, passport) => {
    authRouter(app, passport),
    cloudServiceRouter(app),
    reportsRouter(app),
    rolesRouter(app),
    usersRouter(app)
}