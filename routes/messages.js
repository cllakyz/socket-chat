const express = require('express');
const router = express.Router();

// libs
const Messages = require('../src/lib/Messages');

/* GET messages list. */
router.get('/list', (req, res, next) => {
    Messages.list('@Room:6vCG8hAEu', messages => {
        res.json(messages);
    });
});

module.exports = router;
