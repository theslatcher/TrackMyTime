import React from "react";
import $ from "jquery";

const calc_time_from_db = (currenttime) => {
    let h = Math.floor(currenttime)
    let min = Math.round((currenttime - h) * 60)
    if (min == 60) {
        h++
        min = 0
    }

    return { "hours": h, "min": min }
}

const isLeapYear = (year) => {
    return (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
}

const daysInYear = () => {
    return isLeapYear(new Date().getFullYear()) ? 366 : 365
}

const daysInMonth = () => {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    return new Date(year, month, 0).getDate()
}

const calc_goal = (goal) => {
    let new_goal = 0
    switch (localStorage.getItem('filter')) {
        case 'w':
            new_goal = goal * 7
            break
        case 'm':
            new_goal = goal * daysInMonth()
            break
        case 'y':
            new_goal = goal * daysInYear()
            break
        default: new_goal = goal
    }
    return new_goal
}

class TrackerCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.get_time(props.data.currenttime);
    }

    get_time = (curr_time) => {
        const time = calc_time_from_db(curr_time)
        const goal = calc_goal(this.props.data.goal)
        return { currtime: curr_time, time: time, goal: goal, percentage: Math.round(((curr_time / goal) * 100)) }
    }

    card_form_toggle = () => {
        const menu = $('#card-context-menu')
        let open = false
        if (menu.attr('task-id') != this.props.data.trackerid)
            open = true
        menu.attr('task-id', this.props.data.trackerid)
        menu.attr('task-name', this.props.data.name)
        if (menu.is(':visible'))
            menu.hide();
        else
            open = true
        if (open) {
            menu.show()
            const menu_pos = { x: $($(`#${this.props.data.trackerid}`).children()[1]).position().left, y: $($(`#${this.props.data.trackerid}`).children()[1]).position().top + 
            $($(`#${this.props.data.trackerid}`).children()[1]).height() }
            if ((window.innerWidth - menu_pos.x) < menu.offsetWidth)
                menu.css('left', window.innerWidth - menu.offsetWidth + 'px')
            else
                menu.css('left', menu_pos.x + 'px')
            if ((window.innerHeight - menu_pos.y) < menu.offsetHeight)
                menu.css('top', window.innerHeight - menu.offsetHeight + 'px')
            else
                menu.css('top', menu_pos.y + 'px')
            const ctx_menu_listener = (event) => {
                const $target = $(event.target)
                if (!$target.closest('#card-context-menu').length && $('#card-context-menu').is(':visible')) {
                    $('#card-context-menu').hide()
                    document.removeEventListener('click', ctx_menu_listener)
                }
            }
            //e.stopImmediatePropagation();
            document.addEventListener('click', ctx_menu_listener)
        }
    }

    toggle_add_time = () => {
        $(`#${this.props.data.trackerid}`).find('.card-hidden').toggle('card-hidden');
    }

    add_new_time = () => {
        const card = document.getElementById(this.props.data.trackerid)
        const h = card.children[3].value
        const min = (card.children[5].value / 60)
        const time = Number(h) + Number(min)
        fetch('/../api/time', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                'trackerid': this.props.data.trackerid,
                'totaltime': time,
                'dayofyear': new Date()
            })
        })
        .then(res => {
            fetch(`/../api/task/${this.props.data.trackerid}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'GET'})
                .then(res => res.json())
                .then(res => {
                    this.setState(this.get_time(res.currenttime))
                })
            })
        this.toggle_add_time()
    }

    render() {
        return (
            <>
                <div class="card" style={{ border: '3px solid' + this.props.data.color }} id={this.props.data.trackerid} task-name={this.props.data.name}>
                    <h2 class=""> {this.props.data.name}</h2>
                    <i class="fas fa-bars card-button" onClick={this.card_form_toggle}></i>

                    <h1 class="">{this.state.time.hours + "h"}</h1>
                    <input style={{ borderBottom: '1px solid' + this.props.data.color }} class="form-input card-hidden" type="number" min="0" max="24" placeholder="hrs" oninput="this.value=validateHrs(this.value,this.max)" />
                    <h1 class="">{this.state.time.min + "m"}</h1>

                    <input style={{ borderBottom: '1px solid' + this.props.data.color }} class="form-input card-hidden" type="number" min="0" max="59" placeholder="min" oninput="this.value=validateHrs(this.value,this.max)" />
                    <div class="card-goal">
                        <h2>{this.state.percentage}%</h2>
                        <progress class="progress" value={this.state.currtime} max={this.state.goal} />
                    </div>
                    <div class="addtime_buttons">
                        <i class="far fa-window-close card-button card-hidden" onClick={this.toggle_add_time}></i>
                        <i class="far fa-check-square card-button card-hidden" onClick={this.add_new_time}></i>
                    </div>
                </div>
            </>
        );
    }
}

export default TrackerCard;