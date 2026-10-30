const router = require('express').Router();
const c = require('../controllers/commissionController');
const adminKey = require('../middleware/adminKey');

router.post('/', c.createCommission);
router.get('/', adminKey, c.getCommissions);
router.put('/:id', adminKey, c.updateCommission);

module.exports = router;
