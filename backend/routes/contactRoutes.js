const router = require('express').Router();
const c = require('../controllers/contactController');
const adminKey = require('../middleware/adminKey');

router.post('/', c.createContact);
router.get('/', adminKey, c.getContacts);
router.put('/:id', adminKey, c.updateContact);

module.exports = router;
