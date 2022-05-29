import React from "react";

import '../css/admin.css';
import '../css/reset.css';
import '../css/input-forms.css';
import '../css/nav-bar-btn.css';

import ThemeSwitchButton from "./themeswitchbtn";

class AdminPage extends React.Component {
    render() {
        return (<><header class="primary-header container">
            <div class="logo-title-button-container">
                <div class="logo-title-container">
                    <div class="logo">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="brand-title" onclick="window.location= '/';">Track
                        my time</div>
                </div>
                <div class="toggle-btn">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </div>
            <div class="navbar-links">
                <ul class="tabs">
                    <li class="tab" onclick="logout()">Log out</li>
                    <ThemeSwitchButton/>
                </ul>
            </div>
        </header>
            <h1> Admin Panel </h1>

            <div id="main-div">
                <div id="Users">
                    <h2> Users </h2>
                    <table id="userTable"></table>
                </div>
                <div id="Stats">
                    <h2> Statistics </h2>
                    <table id="statTable"></table>
                </div>
            </div></>);
    }
}

export default AdminPage;