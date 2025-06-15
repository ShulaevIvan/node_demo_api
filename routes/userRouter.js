const router = require('express').Router();
const passport = require('passport');
const hashPassword = require('../utils/hashPassword');
const userModule = require('../modules/userModule');

router.get('/', async (req, res) => {
    return new Promise((resolve, reject) => {
        res.status(201).json({'status': 'ok'});
    });
});

router.post('/signup', async (req, res) => {
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

router.post('/signin', async (req, res, next) => {
    const data = req.body;
    return new Promise((resolve, reject) => {
        passport.authenticate('local', function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send('email or password not valid');
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.status(201).json({'status': 'ok', data: user});
            });
        })(req, res, next);
    });
});

router.delete('/admin/users', async (req, res) => {
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