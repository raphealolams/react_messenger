import User from '../user'
import moment from 'moment'
import {ObjectId} from 'mongodb';
export default class Token{
    constructor(app) {
        this.app = app
    }

    create(userId) {
        // const oneDay = moment().add(1, 'days').toDate()
        const token = {
            userId,
            created: new Date(),
            expired: null
        }

        return new Promise((resolve, reject) => {
            this.app.db.collection('token').insertOne(token, (error, response) => {
                return error ? reject(error) : resolve(token)
            })
        })
    }

    load(tokenId = null) {
        return new Promise((resolve, reject) => {
            return reject({message: "Access Denied"})
        })
    }

    findTokenById(tokenId, cb) {
        const query = {_id: new ObjectId(tokenId)}
        this.app.db.collection('token').fineOne()
    }
}