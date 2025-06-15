const mongoose = require('mongoose');
const userModule = require('../modules/userModule');
const advertismentCollection = require('../models/Advertisement');

class AdvertismentModule {
    constructor() {
        this.advertismentCollection = advertismentCollection;
    }

    async create(data) {
        return new Promise((resolve, reject) => {
            const currentDate = new Date();
            userModule.findByEmail(data.email)
            .then((userData) => {
                if (userData && userData.length > 0) {
                    console.log(data)
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
                        console.log(userData)
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
    }
    async getAll() {
        return new Promise((resolve, reject) => {
            this.advertismentCollection.find()
            .then((data) => {
                resolve(data);
            })
        });
    }
    async remove() {

    }
};

module.exports = new AdvertismentModule();