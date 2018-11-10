import User from '../user'
import moment from 'moment'
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
}