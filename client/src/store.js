import {OrderedMap} from 'immutable'
import _ from 'lodash'
import Service from './service'

export default class Store {
    constructor(appComponent) {
        this.app = appComponent
        this.messages = new OrderedMap();
        this.channels = new OrderedMap();
        this.service = new Service()
        this.activeChannelId = null;
        this.user = this.getUserFromLocalStorage()
        this.users = new OrderedMap()
        this.token = this.getTokenFromLocalStore()
        this.search = {
            user: new OrderedMap()
        }
    }

    setUserAccessToken(accessToken) {
        if (!accessToken) {
            localStorage.removeItem('token')
            this.token = null
            return
        }
        this.token = accessToken
        localStorage.setItem('token', JSON.stringify(accessToken))
    }

    getTokenFromLocalStore() {
        let token = null
        try {
            const data = localStorage.getItem(token)
            if (data) {
                JSON.parse(data)
            }
        }
        catch(err) {
            console.log(err)
        }
    }

    getUserFromLocalStorage() {
        let user = null
        try {
            const data = localStorage.getItem('me')

            if (data) {
                user = JSON.parse(data)
            }
        }
        catch(err) {
            console.log(err)
        }

        return user
    }

    setCurrentUser(user) {
        this.user = user
        if (user) {
            localStorage.setItem('me', JSON.stringify(user))
            const userId = `${user._id}`
            this.users = this.users.set(userId, user)
        }
        this.update()
    }

    login(email = null, password = null) {
        const userEmail = _.toLower(email)

        return new Promise((resolve, reject) => {
            this.service.post("api/users/login", {email, password})
                .then(response => {
                    console.log("logged in")

                    const accessToken = _.get(response, 'data')
                    const user = _.get(accessToken, 'user')
                    this.setCurrentUser(user)
                    this.setUserAccessToken(accessToken)
                })
                    .catch(error => {
                        console.log("Login error")
                        const message = _.get(error, 'response.data.error.message', 'Login Error')
                        return reject(message)
                    })
        })
    }

    signOut() {
        this.user = null
        localStorage.removeItem('me')
        this.update()
    }

    searchUser(search = "") {

        // const keyWord = _.toLower(search)

        return this.search.users.valueSeq()
    }

    getCurrentUser(){
        return this.user
    }

    setActiveChannel(channelId) {
        this.activeChannelId = channelId
        this.update()
    }

    getActiveChannel() {
        const channel = this.activeChannelId ? this.channels.get(this.activeChannelId) : this.channels.first()
        return channel
    }

    addMessage(messageId, message = {}) {
        this.messages = this.messages.set(messageId, message)

        //
        const user = this.getCurrentUser()
        message.user = user
        // add the message to the current channel
        const channelId = _.get(message, 'channelId')

        if (channelId) {
            let channel = this.channels.get(channelId)
            channel.isNew = false
            channel.lastMessage = _.get(message, 'body')
            channel.messages = channel.messages.set(messageId, true)
            this.channels = this.channels.set(channelId, channel)
        }


        this.update()
    }

    getMessages() {
        return this.messages.valueSeq()
    }

    getMessageFromChannel(channel){
        let messages = new OrderedMap()
        if (channel) {  
            channel.messages.forEach((value, key) => {
                const message = this.messages.get(key)
                messages = messages.set(key, message)
            })
        }

        return messages.valueSeq()
    }

    getMembersFromChannel(channel) {
        let members = new OrderedMap()

        if (channel) {
            channel.members.forEach((value, key) => {
                const userId = `${key}`
                const user = this.users.get(userId)
                const loggedUser = this.getCurrentUser()
                if (_.get(loggedUser, '_id') !== _.get(user, '_id')){
                    members = members.set(key, user)
                }
                
            })
        }

        return members.valueSeq();
    }
    
    addChannel(index, channel = {}) {
        this.channels = this.channels.set(`${index}`, channel)
        this.update()
    }

    addUserToChannel(channelId, userId) {

        const channel = this.channels.get(channelId)

        if (channel) {
            channel.members = channel.members.set(userId, true)
            this.channels = this.channels.set(channelId, channel)
            this.update()
        }

    }

    getChannels() {
        this.channels = this.channels.sort((a, b) => a.created < b.created);
        return this.channels.valueSeq()
    }

    onCreateNewChannel(channel = {}) {
        const channelId = _.get(channel, '_id')
        this.addChannel(channelId, channel)
        this.setActiveChannel(channelId)
    }

    removeMemberFromChannel(channel = null, user = null) {
        if (!channel || !user) return

        const userId = _.get(user, '_id')
        const channelId = _.get(channel, '_id')
        channel.members = channel.members.remove(userId)
        this.channels = this.channels.set(channelId, channel)
        this.update()
    }

    update() {
        this.app.forceUpdate()
    }
}