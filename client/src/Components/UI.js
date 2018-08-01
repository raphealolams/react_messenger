import React, {Component} from "react";
import './../Css/app.css'

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
            Left Sidebar
          </div>

          <div className="content">
            <div className="messages">
              {messages.map((message, index) => {
                return(
                  <div className="message">
                    <div className="message-user-image">
                      <img src="https://www.gravatar.com/avatar/000000000000000?d=mm&f=y" alt="user"/>
                    </div>
                    <div className="message-body">
                      <div className="message-author">
                        User says
                      </div>
                      <div className="message-text">
                        Hello there...
                      </div>
                    </div>
                  </div>
                )
              })}
             
            </div>
          </div>

          <div className="right-sidebar">
            Right Sidebar
          </div>
        </div>
      </div>
    )
  }
}

export default UI