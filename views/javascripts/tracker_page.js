const tabs = document.querySelectorAll("[data-tab-target]")
const tabContent = document.querySelectorAll("[data-tab-content]");

const user = () => {
    return (JSON.parse(atob(document.cookie
        .split('; ')
        .find(row => row.startsWith('user_details='))
        .split('=')[1]
        .split('.')[1]
        .replace('-', '+')
        .replace('_', '/'))));
}

const load_trackers = async () => {
    const username = user().user.username;
    document.getElementById('trackers').innerHTML = ""
    document.getElementById('trackers').innerHTML += trackerButtons_template()
    const res = await fetch('http://localhost:3000/task/user/' + username)
    const trackers = await res.json()
    for (let index = 0; index < trackers.length; index++) {
        document.getElementById("cards").innerHTML += card_template(trackers[index])
        const opt = document.createElement('option');
        opt.value = trackers[index].trackerid;
        opt.innerHTML = trackers[index].name;
        document.getElementById("cars").appendChild(opt);
    }
}

const create_tracker = async () => {

    //todo validate?

    const username = user().user.username;

    const response = await fetch("http://localhost:3000/task", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "name": document.getElementById('create_new_card').children[0].value,
            "goal": document.getElementById('create_new_card').children[1].value,
            "color": document.getElementById('create_new_card').children[2].value,
            "username": username
        })
    }
    )

    load_trackers()



}


const delete_tracker = async () => {
    await fetch("http://localhost:3000/time", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify({
            "trackerid": document.getElementById("cars").value
        })
    }
    )
    await fetch("http://localhost:3000/task", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify({
            "trackerid": document.getElementById("cars").value
        })
    }
    )
    load_trackers()


}


function profile_template() {
    const user1 = user().user;
    console.log(user1);
    return (`<h1>Profile page</h1>
            <form id="profile-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="${user1.username}"
                        />
                    <div class="error"></div>
                </div>
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="${user1.first_name}"
                        />
                    <div class="error"></div>
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="${user1.last_name}"
                        />
                    <div class="error"></div>
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input
                        type="email"
                        name="Email"
                        id="email"
                        placeholder="${user1.email}"
                        />
                    <div class="error"></div>
                </div>
                <div class="form-group">
                    <label for="">Password (6 characters minimum)</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="********"
                        />
                    <div class="error"></div>
                </div>
                <div class="form-group">
                    <button type="button" class="possetive">
                     save
                    </button>
                </div>
            </form>
            <button onclick="theme_switch()"id="theme-switch">theme</button>
`)
}

async function add_new_time(button) {
    const h = button.parentElement.children[3].value
    const min = button.parentElement.children[5].value / 60
    const time = Number(h) + Number(min)
    const response = await fetch("http://localhost:3000/time", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "trackerid": button.parentElement.id,
            "totaltime": time,
            "dayofyear": new Date()
        })
    }
    )
    load_trackers()
}

function card_form_toggle(button) {
    button.parentElement.children[3].classList.toggle("card-hidden");
    button.parentElement.children[5].classList.toggle("card-hidden");
    button.parentElement.children[7].classList.toggle("card-hidden");
}

function card_template(tracker) {
    const h = Math.floor(tracker.currenttime)
    let min = (tracker.currenttime - h) * 60
    if (min == 0) min = ""
    else min += "m"
    return (`
        
             <div class="card" style="${"border: 3px solid " + tracker.color}" id="${tracker.trackerid}">
                <h2 > ${tracker.name}</h2>
                <button class = "card-button" style="${"color:" + tracker.color}" onclick="card_form_toggle(this)" >+</button>
                <h1 class="">${h + "h"}</h1>
                
                <input class="form-input card-hidden" type="number" min="1" max="99">
                <h1 class="">${min}</h1>

                <input class="form-input card-hidden" type="number" min="1" max="59">

                <h2 class = "card-goal">${"Goal is " + tracker.goal}</h2>
                <button class = "card-button card-hidden" style="${"color:" + tracker.color}" onclick="add_new_time(this)" >=</button>
            </div>
    `)

}


function trackerButtons_template() {
    return (`
    <div class="button-container">
        <div id="filter_buttons">
            <button onclick="filterButton(id)" id="day">Day</button>
            <button onclick="filterButton(id)" id="week" class="bActive">Week</button>
            <button onclick="filterButton(id)" id="month">Month</button>
            <button onclick="filterButton(id)" id="year">Year</button>
        </div>


        <div class="add-remove-tracker">
            <div class="delete add-remove-tracker">
                <select class="" id="cars">
                    
                </select>
            <button class="negative" onclick="delete_tracker()">Delete</button>
                    </div>

            <button onclick="add_card()" id="bAdd" class="possetive">Add</button>
        </div>
    </div>
    <div id = "cards" class="card-container" >

    </div>
    `)
}



function form_template() {
    return (`
    <form id="create_new_card" class="card" style=" border: 3px solid var(--font-color)">
                    <input class = "form_text"type="text" placeholder="Name">
                    <input class = "form_number" type="number" placeholder="0">
                    <input class = "form_color" type="color">
                    <button class="negative form_button" type="button" onclick="load_trackers()" >x</button>
                    <button class="possetive form_button" type="button" onclick="create_tracker()" >(y)</button>

            </form>`)
}


function theme_switch() {
    const current = localStorage.getItem('theme');
    switch (current) {
        case "theme-dark":
            localStorage.setItem('theme', "theme-light")
            break
        case "theme-light":
            localStorage.setItem('theme', "theme-dark")
            break
        default:
            localStorage.setItem('theme', "theme-dark")
            break

    }
    document.body.removeAttribute("class")
    document.body.classList.add(localStorage.getItem('theme'))


}



tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget)
        tabContent.forEach(tabContent => {
            tabContent.classList.remove('active')
            tabContent.innerHTML = ""
        })

        target.classList.add('active');
        switch (target.id) {

            case "profile":
                document.getElementById("profile").innerHTML = profile_template()
                break
            case "trackers":
                load_trackers()
                break
            default:
        }

    })
})

function add_card() {
    if (!document.getElementById("create_new_card"))
        document.getElementById("cards").innerHTML = form_template() + document.getElementById("cards").innerHTML

}



function filterButton(button) {
    document.getElementsByClassName("bActive")[0].classList.remove("bActive")
    document.getElementById(button).classList.add('bActive')

}

document.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem('theme')
    if (!localStorage.getItem('theme')) theme_switch()
    else document.body.classList.add(localStorage.getItem('theme'))
    load_trackers()
})
