import {OrderedMap} from 'immutable'
import _ from 'lodash'

const users = new OrderedMap({
    '1': {_id: '1', name: "Ajilore Raphael", created: new Date()},
    '2': {_id: '2', name: "Raphael Olumide", created: new Date()},
    '3': {_id: '3', name: "Eniola Seyifunmi", created: new Date()},
})

export default class Store {
    constructor(appComponent) {
        this.app = appComponent
        this.messages = new OrderedMap();
        this.channels = new OrderedMap();
        this.activeChannelId = null;
        this.user = {
            _id: '1',
            name: "Raphael",
            created: new Date()
        }
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
        this.messages = this.messages.set(`${messageId}`, message)

        // add the message to the current channel
        const channelId = _.get(message, 'channelId')

        if (channelId) {
            const channel = this.channels.get(channelId)
            channel.messages = channel.messages.set(messageId, true)
            this.channels = this.channels.set(channelId, channel)
        }


        this.update()
    }

    getMessages() {
        return this.messages.valueSeq()
    }

    getMessageFromChannel(channel){
        let messages = []
        if (channel) {  
            channel.messages.map((value, key)  => {
                const message = this.messages.get(key)
                messages.push(message)
            })  
        }

        return messages
    }

    getMembersFromChannel(channel) {
        const members = []

        if (channel) {
            channel.members.map((value, key) => {
                const member = users.get(key)
                members.push(member)

            })
        }

        return members
    }
    
    addChannel(index, channel = {}) {
        this.channels = this.channels.set(`${index}`, channel)
        this.update()
    }

    getChannels() {
        return this.channels.valueSeq()
    }

    update() {
        this.app.forceUpdate()
    }
}