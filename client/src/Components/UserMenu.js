import React, {Component} from 'react'



export default class UserMenu extends Component {
    constructor(props) {
        super(props)

        this.onClickOutside = this.onClickOutside.bind(this)
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

    render() {
        const {store} = this.props
        return (
            <div className="user-menu" ref={(ref) => this.ref = ref}>
                <h2>My Menu</h2>
                <ul className="user-menu">
                    <li className="menu-item"><button type="button">My Profile</button></li>
                    <li className="menu-item"><button type="button">Change Password</button></li>
                    <li className="menu-item"><button type="button">Sign out</button></li>
                </ul>
            </div>
        )
    }
}