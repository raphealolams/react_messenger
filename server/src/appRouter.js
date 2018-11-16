import moment from 'moment'
import _ from 'lodash';

const START_DATE = new Date()
export default class AppRouter {
    constructor(app) {
        this.app = app
        this.setUpRouter()
    }

    setUpRouter() {
        console.log("Router works")

        const app = this.app


        /**
         * @param {*} res
         * @param {*} req,
         * @param {*} next,
         * @author endpoint
         * @method GET 
         */
        app.get('/', (req, res, next) => {
            return res.json({startDate: moment(START_DATE).fromNow()})
        })


        /**
         * @param {*} res
         * @param {*} req,
         * @param {*} next,
         * @author endpoint
         * @method POST
         * @routes /api/users 
         */
        app.post('/api/users', (req, res, next) => {
            const user = req.body

            app.models.user.create(user)
                .then(response => {
                    _.unset(user, 'password')
                    return res.status(200).json({response})
                })
                    .catch(error => {
                        console.log(error)
                        return res.status(503).json({error})
                    })
        })

                /**
         * @param {*} res
         * @param {*} req,
         * @param {*} next,
         * @author endpoint
         * @method get
         * @routes /api/users/me
        */
        app.get('/api/users/me', (req, res, next) => {
            let tokenId = req.get('authorization')

            if (!tokenId) {
                tokenId = _.get(req, 'query.auth')
            }

            app.models.token.load(tokenId)
                .then(accessToken => {
                    return res.status(200).json(accessToken)
                })
                    .catch(error => {
                        return res.status(401).json({error})
                    })
        }) 


        /**
         * @param {*} res
         * @param {*} req,
         * @param {*} next,
         * @param {*} id
         * @author endpoint
         * @method GET
         * @routes /api/users/:id
        */
        app.get('/api/users/:id', (req, res, next) => {
            const userId = _.get(req, 'params.id')
            app.models.user.load(userId)
                .then(user => {
                    _.unset(user, 'password')
                    return res.status(200).json({user})
                })
                    .catch(error => {
                        console.log(error)
                        return res.status(404).json({error})
                    })
        })


        /**
         * @param {*} res
         * @param {*} req,
         * @param {*} next,
         * @author endpoint
         * @method POST
         * @routes /api/users/login
        */
        app.post('/api/users/login', (req, res, next) => {
            const body = _.get(req, 'body')
            app.models.user.login(body)
                .then(token => {
                    _.unset(token, 'user.password')
                    return res.status(200).json({token})
                })
                    .catch(error => {
                        console.log(error)
                        return res.status(401).json({error})
                    })
        }) 

    }
}