import React, {Component} from "react";
import classNames from 'classnames';
import avatar from '../Image/avater.png';
import {OrderedMap} from 'immutable';
import _ from 'lodash';
import {ObjectId} from '../Helpers/objectid'
import SearchUser from './SearchUser'

class UI extends Component{
  constructor(props) {
    super(props);
    
    this.state = {
      height: window.innerHeight,
      newMessage: 'Hello there...',
      searchUser: ""
    }

    this._onResize = this._onResize.bind(this)
    this._onCreateNewChannel = this._onCreateNewChannel.bind(this)
    this.addTextMessages = this.addTextMessages.bind(this)
    this.handleSend = this.handleSend.bind(this)
    this.renderMessage = this.renderMessage.bind(this)
    this.scrollMessageToBottom = this.scrollMessageToBottom.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize)
    this.addTextMessages()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize)
  }

  componentDidUpdate() {
    this.scrollMessageToBottom()
  }

  _onResize() {
    this.setState({
      height: window.innerHeight
    })
    console.log("window resizing")
  }

  _onCreateNewChannel() {
    const {store} = this.props

    const channelId = new ObjectId().toString()
    const channel = {
      _id: channelId,
      title: "New Channel",
      lastMessage: "",
      members: new OrderedMap({
        '2': true,
        '3': true,
        '1': true
      }),
      messages: new OrderedMap(),
      isNew: true,
      created: new Date()
    }

    store.onCreateNewChannel(channel)
  }

  addTextMessages(){
    const {store} = this.props
    // creates test messages
    for(let i = 0; i < 100; i++){
      let isMe = false

      if (i % 2 === 0) isMe = true

      const newMessage = {
        _id: `${i}`,
        author: `Author: ${i}`,
        body: `The body is: ${i}`,
        avatar: avatar,
        sender: isMe
      }

      store.addMessage(i, newMessage)
    }


    //creates test channels
    for (let index = 0; index < 10; index++) {
      let newChannel = {
        _id: `${index}`,
        title: `Channel Title: ${index}`,
        lastMessage: `here there..... ${index}`,
        members: new OrderedMap({
          '2': true,
          '3': true,
          '1': true
        }),
        messages: new OrderedMap(),
        created: new Date()
      }
      const mssgId = `${index}`
      const moreMssg = `${index+1}`
      newChannel.messages = newChannel.messages.set(mssgId, true)
      newChannel.messages = newChannel.messages.set(moreMssg, true)


      store.addChannel(index, newChannel)
    }
  }
  
  onSelectChannel(key) {
    const {store} = this.props
    store.setActiveChannel(key)
  }

  messageChanged(event) {
    console.log({onChange: event.target.value})
    this.setState({
      newMessage: _.get(event, 'target.value')
    })
  }

  handleSend() {
    const {newMessage} = this.state
    const {store} = this.props

    if (_.trim(newMessage).length) {
      const messageId = new ObjectId().toString()
      const channel = store.getActiveChannel()
      const channelId = _.get(channel, '_id', null)
      const currentUser = store.getCurrentUser()
      
      const message = {
        _id: messageId,
        channelId,
        author: _.get(currentUser, 'name', null),
        body: newMessage,
        avatar: avatar,
        sender: true
      }
      store.addMessage(messageId, message)
  
      this.setState({
        newMessage: ""
      })
    }
  }

  handleKeyUp(event) {
    console.log({key: event.key, shift: event.shiftKey})
    if (event.key === 'Enter' && !event.shiftKey) {
      this.handleSend()
    }
  }

  renderMessage(message){
    const text = _.get(message, 'body', '')

    return _.split(text, '\n').map((m, key) => {
      return <p key={key} dangerouslySetInnerHTML={{__html: m}}></p>
    })
  }

  scrollMessageToBottom() {
    if (this.messageRef) {
      this.messageRef.scrollTop = this.messageRef.scrollHeight
    }
  }

  searchUserText(event) {
    const userText = _.get(event, 'target.value')
    console.log({userText})
    this.setState({
      searchUser: userText
    })
  } 
  
  render() {
    const {store} = this.props
    const {height} = this.state
    const style = { height }
    const activeChannel = store.getActiveChannel()
    const messages =  store.getMessageFromChannel(activeChannel)//store.getMessages()
    const channels = store.getChannels()
    const members = store.getMembersFromChannel(activeChannel)

    return (
      <div style={style} className="app-messenger">
        <div className="header">
          <div className="left">
            <button className="left-action"><i className="icon-settings-streamline-1" /></button>
            <button onClick={this._onCreateNewChannel} className="right-action"><i className="icon-edit-modify-streamline" /></button>
            <h2>Handover Portal</h2>
          </div>
          <div className="content">

            { _.get(activeChannel, 'isNew') ? 
              <div className="toolbar">
                  <label>To</label>
                  <input placeholder=" type user name" onChange={(event) => this.searchUserText(event)} type="text" value={this.state.searchUser} />
                  <h2>{_.get(activeChannel, 'title', '')}</h2>
                  <SearchUser search={this.state.searchUser} store={store}/>
              </div> : <h2>{_.get(activeChannel, 'title', '')}</h2>
            }
          </div> 
          <div className="right">
            <div className="user-bar">
              <div className="profile-name">Ajilore Raphael</div>
              <div className="profile-image">
                <img src={avatar} alt="User"/>
              </div>
            </div>

          </div>
        </div>
        <div className="main">
          <div className="sidebar-left">
            <div className="chanels">
              {channels.map((channel, key) => {
                return(
                  <div onClick={(key) => this.onSelectChannel(channel._id)} key={channel._id} className={classNames('chanel', {'active': _.get(activeChannel, '_id') === _.get(channel, '_id', null) })}>
                  <div className="user-image">
                    <img src={avatar} alt="user"/>
                  </div>
                  <div className="chanel-info">
                    <h2>{channel.title}</h2>
                    <p>{channel.lastMessage}</p>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
          <div className="content">
            <div ref={(ref) => this.messageRef = ref} className="messages">

              {messages.map((message, index) => {
                return (
                    <div key={index} className={classNames('message', {'me': message.sender})}>
                    <div className="message-user-image">
                      <img src={message.avatar} alt="Sender"/>
                    </div>
                    <div className="message-body">
                      <div className="message-author">{message.sender ? "You say" : message.author}</div>
                      <div className="message-text">
                        {this.renderMessage(message)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="messenger-input">
              <div className="text-input">
                <textarea onKeyUp={(event) => this.handleKeyUp(event)} onChange={(event) => this.messageChanged(event)} value={this.state.newMessage} placeholder="Write your message"></textarea>
              </div>
              <div className="actions">
                <button onClick={this.handleSend} className="send">Send</button>
              </div>
            </div>
          </div>
          <div className="sidebar-right">
            <h2 className="title">Members</h2>
            <div className="members">
              {members.map((member, key) => {
                return (
                  <div  key={key} className="member">
                    <div className="user-image">
                      <img src={avatar} alt=""/>
                    </div>

                    <div className="member-info">
                      <h2>{member.name}</h2>
                      <p>Joined: 3 days ago</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UI