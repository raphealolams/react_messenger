import React, {Component} from 'react'



export default class UserMenu extends Component {
    constructor(props) {
        super(props)

        this.onClickOutside = this.onClickOutside.bind(this)
        this.handleSignOut = this.handleSignOut.bind(this)
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.onClickOutside)
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.onClickOutside)
    }

    onClickOutside(event) {
        if (this.ref && !this.ref.contains(event.target)) {
            if (this.props.onClose){
                this.props.onClose()
            }
        }
    }

    handleSignOut() {
        const {store} = this.props
        if (this.props.onClose){
            this.props.onClose()
        }
        store.signOut()
    }

    render() {
        return (
            <div className="user-menu" ref={(ref) => this.ref = ref}>
                <h2>My Menu</h2>
                <ul className="user-menu">
                    <li className="menu-item"><button type="button">My Profile</button></li>
                    <li className="menu-item"><button type="button">Change Password</button></li>
                    <li className="menu-item"><button onClick={this.handleSignOut} type="button">Sign out</button></li>
                </ul>
            </div>
        )
    }
}