import React, {Component} from "react";
import classNames from 'classnames';
import avatar from '../image/avater.png';

class UI extends Component{
  constructor(props) {
    super(props);
    
    this.state = {
      height: window.innerHeight,
      messages: [

      ]
    }

    this._onResize = this._onResize.bind(this)
    this.addTextMessages = this.addTextMessages.bind(this)
    this.genUid = this.genUid.bind(this)
  }

  _onResize() {
    this.setState({
      height: window.innerHeight
    })
    console.log("window resizing")
  }

  addTextMessages(){
    let {messages} = this.state 

    for(let i = 0; i < 100; i++){
      let isMe = false

      if (i % 2 === 0) isMe = true

      const newMessage = {
        author: `Author: ${i}`,
        body: `The body is: ${i}`,
        avatar: avatar,
        uid: this.genUid(),
        sender: isMe
      }

      messages.push(newMessage)
    }

    this.setState({messages: messages})
  }
 
  genUid() {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}
  componentDidMount() {
    window.addEventListener('resize', this._onResize)
    this.addTextMessages()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize)
  }
  
  render() {
    const {height, messages} = this.state
    const style = {
      height
    }
    console.log(messages)
    return (
      <div style={style} className="app-messenger">
        <div className="header">
          <div className="left">
            <div className="action">
              <button>New Message</button>
            </div>
          </div>
          <div className="content">
            <h2>Title</h2>
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
              <div className="chanel">
                <div className="user-image">
                  <img src={avatar} alt="user"/>
                </div>

                <div className="chanel-info">
                  <h2>Ajilore Raphael</h2>
                  <p>Hello there</p>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="messages">

              {messages.map((message, index) => {
                return (
                    <div key={index} className={classNames('message', {'me': message.sender})}>
                    <div className="message-user-image">
                      <img src={message.avatar} alt="Sender"/>
                    </div>
                    <div className="message-body">
                      <div className="message-author">{message.sender ? "You say" : message.author}</div>
                      <div className="message-text">
                        <p>{message.body}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="messenger-input">
              <div className="text-input">
                <textarea placeholder="Write your message"></textarea>
              </div>
              <div className="actions">
                <button className="send">Send</button>
              </div>
            </div>
          </div>
          <div className="sidebar-right">
            <h2 className="title">Members</h2>
            <div className="members">
              <div className="member">
                <div className="user-image">
                  <img src={avatar} alt=""/>
                </div>

                <div className="member-info">
                  <h2>Ajilore Raphael</h2>
                  <p>Joined: 3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UI