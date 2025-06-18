const userCollection = require('../models/User');

const formatResultData = async (data) => {
    const promiseArr = data.map((advItem) => {
    return userCollection.find({_id: advItem.userId})
        .then((userData) => {
            if (userData && userData.length === 0) return {};
            const advObj = {
                id: advItem._id,
                shortTitle: advItem.shortText,
                images: advItem.images,
                user: {
                    id: userData[0]._id,
                    name: userData[0].name
                },
                createdAt: advItem.createdAt,
            };
            return advObj;
        });
    });
    return promiseArr;
};

module.exports = formatResultData;