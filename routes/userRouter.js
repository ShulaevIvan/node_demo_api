const router = require('express').Router();
const bcrypt = require('bcrypt');
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
                return res.status(201).json({'status': 'err', data: err.message});
            })
        });
        
    }
    catch(err) {
        res.status(500).json({'status': 'err', 'message':'server err'});
    }
});

router.post('/api/signin', async (req, res) => {
    const data = req.body;
    return new Promise((resolve, reject) => {
        userModule.findByEmail(data.email)
        .then((targetUserData) => {
            bcrypt.compare(data.password, targetUserData[0].passwordHash, (err, result) => {
                console.log("test:", result);
            });
        })
        res.status(200).json({'status': 'ok'});
    });
});

router.delete('/api/admin/users', async (req, res) => {
    try {
        const data =req.body;
        await userModule.remove(data.email)
        .then((status) => {
            res.status(200).json({'status': 'ok', 'message': status.message});
        })
        .catch((err) => {
            res.status(200).json({'status': 'ok', 'message': err.message});
        })
    }
    catch(err) {
        res.status(500).json({'status': 'errk', 'message':'server err'});
    }
});

module.exports = router;