const router = require('express').Router()

const middlewareToken = require('../middlewares/token')
const middlewareAdmin = require('../middlewares/admin')

const apiAuthRouter = require('./api/auth')
const apiUsersRouter = require('./api/users')
const apiCitiesRouter = require('./api/cities')
const apiSitesRouter = require('./api/sites')

router.use('/auth', apiAuthRouter)
router.use('/users', [middlewareToken.ckeckToken, middlewareAdmin.checkAdmin], apiUsersRouter)
router.use('/cities', [middlewareToken.ckeckToken, middlewareAdmin.checkAdmin], apiCitiesRouter)
router.use('/sites', [middlewareToken.ckeckToken, middlewareAdmin.checkAdmin], apiSitesRouter)
module.exports = router