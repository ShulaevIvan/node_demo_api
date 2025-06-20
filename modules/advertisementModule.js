const mongoose = require('mongoose');
const formatResultData = require('../utils/formatResultData');
const userModule = require('../modules/userModule');
const advertismentCollection = require('../models/Advertisement');

class AdvertismentModule {
    constructor() {
        this.advertismentCollection = advertismentCollection;
    }

    async getAll() {
        return new Promise((resolve, reject) => {
            this.advertismentCollection.find().select('-__v')
            .then((data) => {
                formatResultData(data)
                .then((allData) => {
                    Promise.all(allData).then((resultData) => {
                        resolve(resultData);
                    });
                })
            });
        });
    };

    async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return 'not found';
        
        return new Promise((resolve, reject) => {
            this.advertismentCollection.find({_id: id}).select('-__v')
            .then((data) => {
                formatResultData(data)
                .then((allData) => {
                    Promise.all(allData).then((resultData) => {
                        resolve(resultData);
                    });
                })
            });
        });
    };

    async create(data) {
        return new Promise((resolve, reject) => {
            const currentDate = new Date();
            userModule.findByEmail(data.email)
            .then((userData) => {
                if (userData && userData.length > 0) {
                    const advertisment = {
                        shortText: data.shortTitle,
                        description: data.description,
                        images: data.images,
                        userId: userData[0]._id,
                        createdAt: currentDate,
                        updatedAt: currentDate,
                        tags: [],
                        isDeleted: false,
                    };
                    this.advertismentCollection.create(advertisment)
                    .then((advData) => {
                        const advObj = {
                            id: `${String(advData._id)}`,
                            shortTitle: advData.shortTitle,
                            description: advData.description,
                            images: advData.images,
                            user: {
                                id:  `${String(userData[0]._id)}`,
                                name: `${String(userData[0].name)}`,
                            },
                            createdAt: advData.createdAt,
                        }
                        resolve(advObj);
                    });
                }
                else reject({});
            });
        })
    };

    async remove(advId, userData) {
        return new Promise((resolve, reject) => {
            const { _id, email } = userData;
            this.advertismentCollection.findOneAndUpdate({_id: advId, userId: _id}, {isDeleted: true})
            .then((data) => {
                resolve(data);
            });
        });
    };
};

module.exports = new AdvertismentModule();