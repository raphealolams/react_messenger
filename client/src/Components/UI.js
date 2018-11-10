import React, {Component} from "react";
import classNames from 'classnames';
import avatar from '../Image/avater.png';
import {OrderedMap} from 'immutable';
import _ from 'lodash';
import {ObjectId} from '../Helpers/objectid'
import SearchUser from './SearchUser';
import moment from 'moment';
import UserBar from './UserBar';

class UI extends Component{
  constructor(props) {
    super(props);
    
    this.state = {
      height: window.innerHeight,
      newMessage: 'Hello there...',
      searchUser: "",
      showSearchUser: false
    }

    this._onResize = this._onResize.bind(this)
    this._onCreateNewChannel = this._onCreateNewChannel.bind(this)
    this.handleSend = this.handleSend.bind(this)
    this.renderMessage = this.renderMessage.bind(this)
    this.scrollMessageToBottom = this.scrollMessageToBottom.bind(this)
    this.renderChannelTitle = this.renderChannelTitle.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize)
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
    const currentUser = store.getCurrentUser()
    const currentUserId = _.get(currentUser, '_id')

    const channelId = new ObjectId().toString()
    const channel = {
      _id: channelId,
      title: "",
      lastMessage: "",
      members: new OrderedMap(),
      messages: new OrderedMap(),
      isNew: true,
      userId: currentUserId,
      created: new Date()
    }

    channel.members = channel.members.set(currentUserId, true)
    store.onCreateNewChannel(channel)
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
        body: newMessage,
        userId: _.get(currentUser, '_id'),
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
    this.setState({
      searchUser: userText,
      showSearchUser: true
    })
  } 

  userSelected(user) {
    const {store} = this.props
    this.setState({
      showSearchUser: false,
      searchUser: ''
    }, () => {
      const userId = _.get(user, '_id')
      const activeChannel = store.getActiveChannel()
      const chanelId = _.get(activeChannel, '_id')

      store.addUserToChannel(chanelId, userId)
    })
  }

  renderChannelTitle(channel = null) {

    if (!channel) {
      return null;
    }

    const {store} = this.props
    const members = store.getMembersFromChannel(channel)
    const names = []
    members.forEach((user) => {
      const name = _.get(user, 'name')
      names.push(name)
    })

    let title = _.join(names, ',')

    if (!title && _.get(channel, 'isNew')) {
      title = "New Message"
    }

    return <h2>{title}</h2>
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
                  {
                    members.map((user, key) => {
                      return <span onClick={() => {store.removeMemberFromChannel(activeChannel, user)}} key={key}>{_.get(user, 'name')}</span>
                    })
                  }
                  <input placeholder=" type user name" onChange={(event) => this.searchUserText(event)} type="text" value={this.state.searchUser} />
                  <h2>{_.get(activeChannel, 'title', '')}</h2>
                  {this.state.showSearchUser ? <SearchUser onSelect={(user) => this.userSelected(user)} search={this.state.searchUser} store={store}/> : null}
              </div> : this.renderChannelTitle(activeChannel)
            }
          </div> 
          <div className="right">

            <UserBar store={store}/>
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
                    {this.renderChannelTitle(channel)}
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
                const user = _.get(message, 'user')
                return (
                    <div key={index} className={classNames('message', {'me': message.sender})}>
                    <div className="message-user-image">
                      <img src={_.get(user, 'avater')} alt="Sender"/>
                    </div>
                    <div className="message-body">
                      <div className="message-author">{message.sender ? "You" : _.get(user, 'name')}</div>
                      <div className="message-text">
                        {this.renderMessage(message)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {
              activeChannel  && members.size > 0 ? <div className="messenger-input">
                <div className="text-input">
                  <textarea onKeyUp={(event) => this.handleKeyUp(event)} onChange={(event) => this.messageChanged(event)} value={this.state.newMessage} placeholder="Write your message"></textarea>
                </div>
                <div className="actions">
                  <button onClick={this.handleSend} className="send">Send</button>
                </div>
              </div> : null
            }
          </div>
          <div className="sidebar-right">
            { members.size > 0 ?
              <div>
                <h2 className="title">Members</h2>
                <div className="members">
                  {members.map((member, key) => {
                    return (
                      <div key={key} className="member">
                        <div className="user-image">
                          <img src={_.get(member, 'avater')} alt=""/>
                        </div>

                        <div className="member-info">
                          <h2>{member.name}</h2>
                          <p>Joined: {moment(member.created).fromNow()}</p>
                        </div>
                      </div>
                    )
                  })}
                </div> 
              </div> : null
            }
          </div>
        </div>
      </div>
    )
  }
}

export default UI