var router = require('express').Router(),
    User   = require('../api/user/user.model');
    
require('./local/passport').setup(User);

router.use('/local', require('./local'));

module.exports = router;