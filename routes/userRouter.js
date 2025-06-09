const router = require('express').Router();
const hashPassword = require('../utils/hashPassword');
const userModule = require('../modules/userModule');

router.get('/', async (req, res) => {
    return new Promise((resolve, reject) => {
        res.status(201).json({'status': 'ok'});
    });
});

router.post('/api/signup', async (req, res) => {
    try {
        const data = req.body;
        await hashPassword(data.password)
        .then((hashPassword) => {
            const userData = {
                email: data.email,
                name: data.name,
                contactPhone: data.contactPhone,
                passwordHash: hashPassword,
            };
            userModule.create(userData)
            .then((userObj) => {
               return res.status(201).json({'status': 'ok', data: userObj});
            })
            .catch((err) => {
                return res.status(201).json({'status': 'err', data: {}});
            })
        });
        
    }
    catch(err) {
        return res.status(500).json({'status': '500 err'});
    }
});

router.post('/api/signin', async (req, res) => {
    return new Promise((resolve, reject) => {
        res.status(201).json({'status': 'ok'});
    });
});

module.exports = router;