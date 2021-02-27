const router = require('express').Router()
const { Site, City } = require('../../db')
const { check, validationResult } = require('express-validator')

/**
 * Get all sites
 */
router.get('/', async(req, res) => {
    let sites = await Site.findAll()
    res.json(sites)
})

/**
 * Create a site
 */
router.post('/', [
    check('address', 'La dirección es obligatoria con minimo 4 letras').not().isEmpty().isLength({ min: 4 }),
    check('idCity', 'La cuidad es obligatoria').not().isEmpty()
], async(req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) return res.status(422).json({ error: error.array() })

    let city = await City.findOne({ where: { id: req.body.idCity } })
    if (!city) return res.json({ error: 'No se encontro esa ciudad' })

    let site = await Site.create(req.body)
    res.json(site)
})

/**
 * Update a site
 */
router.put('/:siteId', [
    check('address', 'La dirección no puede tener menos de 4 caracteres').optional().isLength({ min: 4 }),
    check('idCity', 'La ciudad no puede estar vacia').optional().isInt({ min: 1 })
], async(req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) return res.status(422).json({ error: error.array() })

    if (req.body.idCity) {
        let city = await City.findOne({ where: { id: req.body.idCity } })
        if (!city) return res.json({ error: 'No se encontro esa ciudad' })
    }

    await Site.update(req.body, {
        where: { id: req.params.siteId }
    })
    res.json({ success: 'Se ha modificado' })
})

/**
 * Delete a site
 */
router.delete('/:siteId', async(req, res) => {
    await Site.destroy({
        where: { id: req.params.siteId }
    })
    res.json({ success: 'Se ha borrado' })
})

module.exports = router