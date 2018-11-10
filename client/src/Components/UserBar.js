import React, {Component} from 'react'
import _ from 'lodash';
import avater from '../Image/avater.png'
import UserForm from './UserForm';
import UserMenu from './UserMenu';


export default class UserBar extends Component {
    constructor(props){
        super(props)
        this.state = {
            showUserLogin: false,
            showUserMenu: false
        }

        this.showForm = this.showForm.bind(this)
        this.hideForm = this.hideForm.bind(this)
    }

    showForm() {
        this.setState({
            showUserLogin: true
        })
    }

    hideForm() {
        this.setState({
            showUserLogin: false
        })
    }

    render() {
        const {store} = this.props
        const me = store.getCurrentUser()
        return (
            <div className="user-bar">
            { !me ? <button onClick={this.showForm} type="button" className="login-btn">Sign In</button> : null}
            <div className="profile-name">{_.get(me, 'name')}</div>
            <div className="profile-image" onClick={() => this.setState({showUserMenu: true})}>
              <img src={_.get(me, 'avater') ? _.get(me, 'avater') : avater } alt="User"/>
            </div>
            {
                !me && this.state.showUserLogin ? 
                    <UserForm onClose={this.hideForm} store={store}/> 
                : null
            }

            {
                this.state.showUserMenu ? 
                    <UserMenu store={store} onClose={() => this.setState({showUserMenu: false})}/> 
                : null
                
            }
          </div>
        )
    }
}

