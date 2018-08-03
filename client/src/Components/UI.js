import React, {Component} from "react";
import './../Css/app.css';
import classNames from 'classnames'

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

    for(let i = 0; i < 50; i++){
      let isMe = false

      if (i % 2 === 0) isMe = true

      const newMessage = {
        author: `Author: ${i}`,
        body: `The body is: ${i}`,
        avatar: 'https://www.gravatar.com/avatar/000000000000000?d=mm&f=y',
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

  componentWillMount() {
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
            <div className="actions">
              <button>New Messages</button>
            </div>
          </div>
          <div className="content">
            <h2>Title</h2>
          </div>
          <div className="right">
            <div className="user-bar">
              <div className="profile-name">
                Ajilore Raphael
              </div>
              <div className="profile-image">
                <img src="https://www.gravatar.com/avatar/000000000000000?d=mm&f=y" alt="user"/>
              </div>
            </div>
          </div>
        </div>
        <div className="main-content">
          <div className="left-sidebar">
            <div className="channels">
              <div className="channel">
                <div className="user-image">
                  <img src="https://www.gravatar.com/avatar/000000000000000?d=mm&f=y" alt="user"/>
                </div>
                <div className="channel-info">
                  <h2>Ajilore, Raphael</h2>
                  <p>Hello boy</p>
                </div>
              </div>

              <div className="channel">
                <div className="user-image">
                  <img src="https://www.gravatar.com/avatar/000000000000000?d=mm&f=y" alt="user"/>
                </div>
                <div className="channel-info">
                  <h2>Ajilore, Raphael</h2>
                  <p>Hello boy</p>
                </div>
              </div>
            </div>
          </div>

          <div className="content">
            <div className="messages">
              {messages.map((message, index) => {
                return(
                  <div key={index} className={classNames('message', {'agent': message.sender})}>
                    <div className="message-user-image">
                      <img src={message.avatar} alt="user"/>
                    </div>
                    <div className="message-body">
                      <div className="message-author">
                        {message.sender ? "Agent" : message.author} says
                      </div>
                      <div className="message-text">
                        {message.body} {message.uid}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="message-input">
              <div className="text-input">
                <textarea placeholder="write something....."/>
              </div>
              <div className="actions">
                <button className="send">Send</button>
              </div>
            </div>

          </div>

          <div className="right-sidebar">
            <div className="members">
              <div className="member">
                <div className="user-image">
                  <img src="https://www.gravatar.com/avatar/000000000000000?d=mm&f=y" alt="user"/>
                </div>

                <div className="member-info">
                  <h2>Ajilore Raphae Olamide</h2>
                  <p>dont wake me up</p>
                </div>
              </div>

              <div className="member">
                <div className="user-image">
                  <img src="https://www.gravatar.com/avatar/000000000000000?d=mm&f=y" alt="user"/>
                </div>

                <div className="member-info">
                  <h2>Ajilore Raphae Olamide</h2>
                  <p>dont wake me up</p>
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