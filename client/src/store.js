import {OrderedMap} from 'immutable'

const users = new OrderedMap({
    1: {_id: 1, name: "Ajilore Raphael", created: new Date()},
    2: {_id: 2, name: "Raphael Olumide", created: new Date()},
    3: {_id: 3, name: "Eniola Seyifunmi", created: new Date()},
})

export default class Store {
    constructor(appComponent) {
        this.app = appComponent
        this.messages = new OrderedMap();
        this.channels = new OrderedMap();
        this.activeChannelId = null;
        this.user = {
            _id: 0,
            name: "Raphael",
            created: new Date()
        }
    }

    getActiveChannel() {
        const channel = this.activeChannelId ? this.channels.get(this.activeChannelId) : this.channels.first()
    }

    addMessage(index, message = {}) {
        this.messages = this.messages.set(index, message)
        this.update()
    }

    getMessages() {
        return this.messages.valueSeq()
    }

    addChannel(index, channel = {}) {
        this.channels = this.channels.set(index, channel)
        this.update()
    }

    getChannels() {
        return this.channels.valueSeq()
    }

    update() {
        this.app.forceUpdate()
    }
}