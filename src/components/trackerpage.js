import React from "react";

import '../css/reset.css';
import '../css/theme.css';
import '../css/input-forms.css';
import '../css/nav-bar-btn.css';
import '../css/tracker_page.css';

import ThemeSwitchButton from "./themeswitchbtn";
import TrackerCard from "./trackerpage/trackercard";
import ProfilePage from "./trackerpage/profile";
import GraphsPage from "./trackerpage/graphs";
import NavbarTab from "./lib/navbartab";

const userId = () => {
    const data = JSON.parse(localStorage.getItem('user_details'));
    return data.user.userId
}

class CardsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { cards: [] };

        window.addEventListener('trackerFilterChange', () => {
            this.updateTrackers()
        })
    }

    updateTrackers = () => {
        const url = new URL(window.location.href + '/../api/task/user/' + userId())
        url.searchParams.append(localStorage.getItem('filter'), new Date())
        fetch(url).then(res => res.json()).then(res => {
            this.setState({cards: res, filter: localStorage.getItem('filter')})
        })
    }

    componentDidMount() {
        this.updateTrackers()
    }

    render() {
        return (
            <div id="cards" class="card-container">
                {
                    this.state.cards.map(card => <TrackerCard key={card.trackerid + this.state.filter} data={card} />)
                }
            </div>
        )
    }
}

class FilterButton extends React.Component {
    handleClick = () => {
        const elem = document.getElementById(`${this.props.id}`);

        if (!elem.classList.contains('bActive'))
        {
            document.getElementById('filter_buttons').querySelector('.bActive').classList.toggle('bActive')
            localStorage.setItem('filter', this.props.id)
            elem.classList.add('bActive')
            window.dispatchEvent(new Event('trackerFilterChange'));
        }
    }

    render() {
        return (
            <button onClick={this.handleClick} id={this.props.id}>{this.props.name}</button>
        )
    }
}

class TrackerPage extends React.Component {
    componentDidMount() {
        if (!localStorage.getItem('filter'))
            localStorage.setItem('filter', 'd')

        //start with trackers page.
        document.getElementById(localStorage.getItem('filter')).classList.add('bActive')
    }

    logOut = () => {
        localStorage.removeItem('user_details')
        localStorage.removeItem('pieData')
        localStorage.removeItem('lineData')
        localStorage.removeItem('trackerData')

        fetch('/user/signout')
        window.location.href = '/'
    }

    render() {
        return (<><header class="primary-header container">
            <div class="logo-title-button-container">
                <div class="logo-title-container">
                    <div class="logo">
                        <i class="fas fa-clock" />
                    </div>
                    <div class="brand-title" onclick="window.location= '/';">Track
                        my time</div>
                </div>
                <div class="toggle-btn">
                    <span class="bar" />
                    <span class="bar" />
                    <span class="bar" />
                </div>
            </div>
            <div class="navbar-links">
                <ul class="tabs">
                    <NavbarTab idf="profile" name="Profile" />
                    <NavbarTab idf="trackers" name="Trackers" />
                    <NavbarTab idf="graphs" name="Graphs" />
                    <li class="tab" onClick={this.logOut}>Log out</li>
                    <ThemeSwitchButton />
                </ul>
            </div>
        </header>
            <ProfilePage/>
            <GraphsPage/>
            <div id="trackers" data-tab-content class="active">
                <div class="button-container">
                    <div id="filter_buttons">
                        <FilterButton id="d" name="Day"/>
                        <FilterButton id="w" name="Week"/>
                        <FilterButton id="m" name="Month"/>
                        <FilterButton id="y" name="Year"/>
                    </div>
                    <button onclick="add_card()" class="possetive add_tracker">Add</button>
                </div>
                <CardsContainer />
            </div>

            <nav class="card-context-menu" id="card-context-menu">
                <ul class="card-context-menu-items">
                    <li class="card-context-menu-item"
                        onclick="toggle_add_time($(this).parent().parent().attr('task-id'));
                        $(this).parent().parent().hide()">Add Time</li>
                    <li class="card-context-menu-item" onclick="toggle_edit_tracker($(this).parent().parent().attr('task-id'));
                    $(this).parent().parent().hide()">Edit</li>
                    <li class="card-context-menu-item" onclick="delete_tracker($(this).parent().parent().attr('task-id'),
                    $(this).parent().parent().attr('task-name'));
                    $(this).parent().parent().hide()">Delete</li>
                </ul>
            </nav></>);
    }
}

export default TrackerPage;