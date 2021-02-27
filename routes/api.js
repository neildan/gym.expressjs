const router = require('express').Router()

const middlewareToken = require('../middlewares/token')
const middlewareAdmin = require('../middlewares/admin')

const apiUsersRouter = require('./api/users')
const apiCitiesRouter = require('./api/cities')
const apiSitesRouter = require('./api/sites')

router.use('/users', apiUsersRouter)
router.use('/cities', [middlewareToken.ckeckToken, middlewareAdmin.checkAdmin], apiCitiesRouter)
router.use('/sites', [middlewareToken.ckeckToken, middlewareAdmin.checkAdmin], apiSitesRouter)
module.exports = router