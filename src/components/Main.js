import React, { Component } from 'react'
import logo from './ruletik.svg'
import logosign from './ruletik-sign.svg'
import './Main.sass'

class Main extends Component {
    render() {
        return (

            <div className="Main">
                <div className="Header">
                    <img src={logo} className="logo" alt="Ruletik"></img>
                </div>

                <div className="Footer">
                    <img src={logosign} className="logo" alt="Ruletik"></img>
                    <div className="contacts-wrapper">
                        <a className="padding-right" href="hi@ruletik.com">hi@ruletik.com</a>
                        <a className="padding-right" href="https://dribbble.com/ruletik">Dribbble</a>
                        <a className="padding-right" href="https://www.facebook.com/iamruletik/">Facebook</a>
                        <a href="https://t.me/ruletik">Telegram</a>        
                    </div>
                </div>
            </div>
            
        )
    }
}

export default Main