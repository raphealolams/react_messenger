import _ from 'lodash'
import bcrypt from 'bcrypt';
import {isEmail} from '../../helpers'
import {ObjectId} from 'mongodb'
import {OrderedMap} from 'immutable'

export default class User {
    constructor(app) {
        this.app = app
        this.users = new OrderedMap()
    }


    beforeSave(user, cb){
        const db = this.app.db
        let errors = []
        const fields = ['name', 'email', 'password']

        let validations = {
            name: {
                errorMessage: "Name is required",
                do: () => {
                    const name = _.get(user, 'name', '')
                    return name.length
                }
            },

            email: {
                errorMessage: "Email is required",
                do: () => {
                    const email = _.get(user, 'email', '');
                    
                    if (!email.length || !isEmail(email)) return false

                    return true
                }
            },

            password: {
                errorMessage: "Password is required and should be more than three character",
                do: () => {
                    const password = _.get(user, 'password', '')
                    
                    if (!password.length || password.length < 3) return false

                    return true
                }
            }
        }

        fields.forEach((field) => {
            const fieldValidation = _.get(validations, field)

            if (fieldValidation) {
                const isValid = fieldValidation.do()
                const message = fieldValidation.errorMessage

                if (!isValid) {
                    errors.push(message)
                }
            }
        })

        if (errors.length) {
            const err = _.join(errors, ',')
            return cb(err, null)
        }

        const email = _.toLower(_.trim(_.get(user, 'email')))
        db.collection('users').findOne({email}, (error, result) => {
            if (error || result) return cb({message: "Email already exist"}, null)
            const password = _.get(user, 'password')
            const hashPassword = bcrypt.hashSync(password, 10)
            const newUser = {
                name: `${_.trim(_.get(user, 'name'))}`,
                email,
                password: hashPassword,
                avater: ``,
                created: new Date()
            }


            return cb(null, newUser)
        })
    }

    create(user) {
        const db = this.app.db
        return new Promise((resolve, reject) => {
            this.beforeSave(user, (error, response) => {
                if (error) return reject(error)

                db.collection('users').insertOne(response, (err, info) => {
                    if (err) return reject({message: "An error occurred while saving user"})
                    const userId = _.toString(_.get(info, '_id'))
                    this.users = this.users.set(userId, response)
                    resolve(response)
                })
            })
        })
    }

    findUserById(id, cb) {
        const db = this.app.db
        if (!id) return cb({message: "User not found"}, null)
        const userId = new ObjectId(id)
        db.collection('users').findOne({_id: userId}, (err, result) => {
            if (err || !result) return cb({message: "User Not found"}, null)

            return cb(null, result)
        })

    }

    load(userId) {
        return new Promise((resolve, reject) => {
            const userInCache = this.users.get(userId)
            if (userInCache) return resolve(userInCache)

            this.findUserById(userId, (err, user) => {
                if (!err && user) {
                    this.users = this.users.set(userId, user)
                }

                return err ? reject(err) : resolve(user)
            })
        })
    }

    login(user) {
        const email = _.get(user, 'email', '')
        const password = _.get(user, 'password', '')

        return new Promise((resolve, reject) => {
            if (!email || !password || !isEmail(email)) {
                reject({message: "An error on Login"})
            }

            this.findUserByEmail(email, (error, foundUser) => {
                if (error) reject({message: "Login Error"})

                const hashPassword = _.get(foundUser, 'password')
                console.log(hashPassword)
                const passwordMatch = bcrypt.compareSync(password, hashPassword)

                if (!passwordMatch) return reject({message: "Login Error"})

                const userId = foundUser._id
                this.app.models.token.create(userId)
                    
                    .then(token =>  {
                        token.user = foundUser
                        resolve(token)
                    })
                        .catch(err =>  reject({message: "Login Error"}))
               
            })


        })
    }

    findUserByEmail(email, cb){
        const db = this.app.db
        db.collection('users').findOne({email}, (error, response) => {
            if (error || !response) return cb({message: "User not Found"}, null)

            return cb(null, response)
        })
    }
}