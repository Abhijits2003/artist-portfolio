const router = require('express').Router();
const c = require('../controllers/artworkController');

router.get('/', c.getArtworks);
router.get('/:id', c.getArtwork);
router.post('/:id/like', c.likeArtwork);
router.delete('/:id/like', c.unlikeArtwork);
router.post('/:id/view', c.viewArtwork);

module.exports = router;
