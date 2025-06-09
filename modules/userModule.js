const userCollection = require('../models/User');

class UserModule {
    constructor() {
        this.userCollection = userCollection;
    }

    async create(data) {
        return new Promise((resolve, reject) => {

            const user = {
                email: data.email,
                passwordHash: data.passwordHash,
                name: data.name,
                contactPhone: data.contactPhone ? data.contactPhone : '',
            };
            const userObj = userCollection.create(user);
            resolve(userObj);
        });
    }

    async findByEmail() {
       try {
            return new Promise((resolve, reject) => {
                const targetUser = this.userCollection.find({email: email}) ? userCollection.find({email: email}) : null;
                resolve(targetUser);
            })
        }
        catch(err) {
        
        }
    }
};


module.exports = new UserModule();