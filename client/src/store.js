import {OrderedMap} from 'immutable'
import _ from 'lodash'

const users = new OrderedMap({
    '1': {_id: '1', email: "raphealolams@yahoo.com", name: "Ajilore Raphael", created: new Date(), avater: 'https://api.adorable.io/avatars/100/raphael@adorable.png'},
    '2': {_id: '2', email: "rolumide@gmail.com", name: "Raphael Olumide", created: new Date(), avater: 'https://api.adorable.io/avatars/100/olumide@adorable.png'},
    '3': {_id: '3', email: "eniseyi@yahoo.com", name: "Eniola Seyifunmi", created: new Date(), avater: 'https://api.adorable.io/avatars/100/seyi@adorable.png'},
})

export default class Store {
    constructor(appComponent) {
        this.app = appComponent
        this.messages = new OrderedMap();
        this.channels = new OrderedMap();
        this.activeChannelId = null;
        this.user = this.getUserFromLocalStorage()
    }

    getUserFromLocalStorage() {
        let user = null
        try {
            const data = localStorage.getItem('me')
            console.log({data})

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
        }
        this.update()
    }

    login(email, password) {
        const userEmail = _.toLower(email)
        const _this = this
        return new Promise((resolve, reject) => {
            const user = users.find(user => user.email === userEmail)
            if (user) {
                _this.setCurrentUser(user)
            }
            return user ? resolve(user) : reject("User Not Found")
        })
    }

    searchUser(search = "") {

        const keyWord = _.toLower(search)
        const currentUser = this.getCurrentUser()
        const currentUserId = _.get(currentUser, '_id')

        let searchItems = new OrderedMap()
        
        if (_.trim(search).length) {    

            searchItems = users.filter((user) => _.get(user, '_id') !== currentUserId && _.includes(_.toLower(_.get(user, 'name')), keyWord))
        }
        return searchItems.valueSeq()
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
                const user = users.get(key)
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