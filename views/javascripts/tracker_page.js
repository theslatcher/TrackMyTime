const tabs = document.querySelectorAll("[data-tab-target]")
const tabContent = document.querySelectorAll("[data-tab-content]");
const username = "test8"

const load_trackers = async () => {
    document.getElementById('trackers').innerHTML = ""
    document.getElementById('trackers').innerHTML += trackerButtons_template()
    const res = await fetch('http://localhost:3000/task')
    const trackers = await res.json()
    console.log(trackers);
    for (let index = 0; index < trackers.length; index++) {
        document.getElementById("cards").innerHTML += card_template(trackers[index])
    }


}



function profile_template() {
    return (`<h1>Profile page</h1>
            <form id="profile-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        />
                    <div class="error"></div>
                </div>
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="First name"
                        />
                    <div class="error"></div>
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Last name"
                        />
                    <div class="error"></div>
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input
                        type="email"
                        name="Email"
                        id="email"
                        placeholder="name@something.com"
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

async function test(button) {




    const h = button.parentElement.children[4].firstElementChild.value
    const min = button.parentElement.children[4].lastElementChild.value / 60
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
    console.log(response);
}

function card_template(tracker) {
    const h = Math.floor(tracker.currenttime)
    const min = (tracker.currenttime - h) * 60
    return (`
        
             <div class="card" style="${"border: 3px solid " + tracker.color}" id="${tracker.trackerid}">
                <h2 > ${tracker.name}</h2>
                <button class = "card-button" style="${"color:" + tracker.color}" onclick="test(this)" >+</button>
                <h1 class="">${h + "h"}</h1>
                <h1 class="">${min + "m"}</h1>
                
                 <div class="card-current">
                <input class="card-input" type="number" min="1" max="99">
                <input class="card-input" type="number" min="1" max="59">
                 </div>
                <h2 class = "card-goal">${"Goal is " + tracker.goal}</h2>
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
            <button class="negative">Delete</button>
            <button onclick="add_card()" id="bAdd" class="possetive">Add</button>
        </div>
    </div>
    <div id = "cards" class="card-container" >

    </div>
    `)
}



function form_template() {
    return (`
    <form class="card" style=" border: 3px solid var(--font-color)">
                    <h2>Create New</h2>

                    <input class = "form_text"type="text">

                    <input class = "form_number" type="number">
                    <input class = "form_color" type="color">

                <div class="form_buttons">
                    <button class="negative form_button" type="button" onclick="load_trackers()" >x</button>
                    <button class="possetive form_button" type="button">(y)</button>
                    </div>

            </form>`)
}


function theme_switch() {

    const current = localStorage.getItem('theme');
    console.log(current);
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
    document.getElementById("cards").innerHTML = form_template() + document.getElementById("cards").innerHTML


}



function filterButton(button) {
    document.getElementsByClassName("bActive")[0].classList.remove("bActive")
    document.getElementById(button).classList.add('bActive')

}

document.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem('theme')
    if (!theme) theme_switch()
    else document.body.classList.add(theme)
    load_trackers()
})
