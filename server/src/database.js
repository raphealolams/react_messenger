import {MongoClient} from 'mongodb'
import assert  from 'assert';

export default class Database {


    connect() {
        return new Promise ((resolve, reject) => {
            const client = new MongoClient(process.env.DATABSE_URL);
            
            client.connect((error) => {
                if (error) return reject(error)
                return resolve(client.db(process.env.DATABASENAME))
                
            })
        })
    }
}