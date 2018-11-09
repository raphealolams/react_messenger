import React, {Component} from 'react'
import _ from 'lodash'


export default class SearchUser extends Component {


    render(){
        const {store} = this.props
        const users = store.searchUser()
        return (
            <div className="search-user">
                <div className="user-list">
                    {users.map((user, index) => {
                        return (
                            <div key={index} className="user">
                                <img src={_.get(user, 'avater')} alt="..."/>
                                <h2>{_.get(user, 'name')}</h2>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}