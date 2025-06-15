const router = require('express').Router();
const uploadMiddleware = require('../utils/uploadFile');
const isAuthenticated = require('../utils/isAuthenticated');
const AdvertismentModule = require('../modules/advertisementModule');
const advertisementModule = require('../modules/advertisementModule');

router.get('/advertisements', async (req, res) => {
    try {
        advertisementModule.getAll()
        .then((data) => {
            res.status(200).json({status: 'ok', data: data});
        })
    }
    catch(err) {
        res.status(500).json({status: 'err', data: err});
    }
});

router.post('/advertisements',
    isAuthenticated, 
    uploadMiddleware.array('images'),
    async (req, res) => {
    try {
        const files = req.files;
        const { shortTitle, description } = req.body;

        if (files) {
            const pathArr = [];
            
            files.forEach((fileItem) => {
                const { path } = fileItem;
                pathArr.push(path);
            });

            const advData = {
                email: req.session.passport.user.email,
                name: req.session.passport.user.name,
                shortTitle: shortTitle,
                description: description,
                images: pathArr
            };
            
            await AdvertismentModule.create(advData)
            .then((data) => {
                return res.status(201).json({data: data, status: 'ok'});
            });
        }
        else return res.status(500).json({status: 'err'});

    }
    catch(err) {
        return res.status(500).json({status: 'err'});
    }
});


module.exports = router;