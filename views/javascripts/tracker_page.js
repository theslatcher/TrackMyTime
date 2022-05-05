const tabs = document.querySelectorAll("[data-tab-target]")
const tabContent = document.querySelectorAll("[data-tab-content]");

async function user() {
    const data = JSON.parse(atob(document.cookie
        .split('; ')
        .find(row => row.startsWith('user_details='))
        .split('=')[1]
        .split('.')[1]
        .replace('-', '+')
        .replace('_', '/')));

    const res = await fetch('http://localhost:3000/user/' + data.user.username)
    const user1 = await res.json()
    return (user1)
}

const load_trackers = async () => {
    const user1 = await user();
    document.getElementById('trackers').innerHTML = ""
    document.getElementById('trackers').innerHTML += trackerButtons_template()

    document.getElementById(localStorage.getItem('filter')).classList.add("bActive")


    const res = await fetch('http://localhost:3000/task/user/' + user1.username)
    const trackers = await res.json()
    for (let index = 0; index < trackers.length; index++) {
        //temp code
        const res = await fetch('http://localhost:3000/task/' + trackers[index].trackerid)
        const tracker = await res.json()
        //

        document.getElementById("cards").innerHTML += card_template(tracker)
        const opt = document.createElement('option');
        opt.value = trackers[index].trackerid;
        opt.innerHTML = trackers[index].name;
        document.getElementById("select").appendChild(opt);
    }
}

const create_tracker = async () => {

    //todo validate?

    const user1 = await user();
    await fetch("http://localhost:3000/task", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "name": document.getElementById('create_new_card').children[0].value,
            "goal": document.getElementById('create_new_card').children[2].value,
            "color": document.getElementById('create_new_card').children[4].value,
            "username": user1.username
        })
    }
    )

    load_trackers()



}


const delete_tracker = async () => {
    if (confirm("Do you want to delete " + document.getElementById("select").options[document.getElementById("select").selectedIndex].text + "?")) {
        await fetch("http://localhost:3000/time", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify({
                "trackerid": document.getElementById("select").value
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
                "trackerid": document.getElementById("select").value
            })
        }
        )
        load_trackers()
    }

}

async function logout() {
    await fetch('http://localhost:3000/user/signout')
    location.href = '/'
}

async function editUser() {


    let username = document.getElementById("username").value
    if (!username)
        username = document.getElementById("username").getAttribute("placeholder")
    let first_name = document.getElementById("first_name").value
    if (!first_name)
        first_name = document.getElementById("first_name").getAttribute("placeholder")
    let last_name = document.getElementById("last_name").value
    if (!last_name)
        last_name = document.getElementById('last_name').getAttribute("placeholder")
    let email = document.getElementById("email").value
    if (!email)
        email = document.getElementById("email").getAttribute("placeholder")


    const user1 = await user();

    await fetch("http://localhost:3000/user/" + user1.username,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({
                "username": username,
                "first_name": first_name,
                "last_name": last_name,
                "email": email
            })

        })
    const user2 = await user();
    document.getElementById("profile").innerHTML = profile_template(user2)
}
function profile_template(user1) {
    return (`<h1>Profile page</h1>
            <form id="profile-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        readonly
                        placeholder="${user1.username}"
                        />
                    
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        id="first_name"
                        placeholder="${user1.first_name}"
                        />
                    
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        id="last_name"
                        placeholder="${user1.last_name}"
                        />
                   
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input
                        type="email"
                        name="Email"
                        id="email"
                        placeholder="${user1.email}"
                        />
                    
                <div class="button-group">
                <button onclick="logout()"type="button" class="negative">
                     Log out
                    </button>
                <button type="button" onclick="theme_switch()"id="theme-switch">theme</button>
                    <button onclick="editUser()"type="button" class="possetive">
                     save
                    </button>
                </div>
           
            
             </form>
`)
}

async function add_new_time(button) {
    const h = button.parentElement.children[3].value
    const min = (button.parentElement.children[5].value / 60).toFixed(2)
    const time = Number(h) + Number(min)
    await fetch("http://localhost:3000/time", {
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
    let min = Math.floor((tracker.currenttime - h) * 60)
    if (min == 0) min = ""
    else min += "m"
    return (`
        
             <div class="card" style="${"border: 3px solid " + tracker.color}" id="${tracker.trackerid}">
                <h2 class = "form_text"> ${tracker.name}</h2>
                <button class = "card-button" style="${"color:" + tracker.color}" onclick="card_form_toggle(this)" >+</button>
                <h1 class="">${h + "h"}</h1>
                
                <input style="${"border-bottom: 1px solid " + tracker.color}" class="form-input card-hidden" type="number" min="1" max="99" placeholder="hrs">
                <h1 class="">${min}</h1>

                <input style="${"border-bottom: 1px solid " + tracker.color}" class="form-input card-hidden" type="number" min="1" max="59" placeholder="min" >

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
            <button onclick="filterButton(id)" id="week" >Week</button>
            <button onclick="filterButton(id)" id="month">Month</button>
            <button onclick="filterButton(id)" id="year">Year</button>
        </div>


        <div class="add-remove-tracker">
            <div class="delete add-remove-tracker">
                <select class="" id="select">
                    
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


function test(some) {
    document.getElementById("create_new_card").setAttribute("style", "border: 3px solid" + some.value)
    document.getElementById("newgoal").setAttribute("style", "border-bottom: 1px solid" + some.value)

}
function form_template() {
    return (`
    <form id="create_new_card" class="card" style=" border: 3px solid var(--font-color)">
                    <input class = "form_text"type="text" placeholder="Name">
                    <h1 class="form-title">Goal</h1>
                    <input class = "form-input" type="number" id="newgoal"placeholder="0" min="0">
                    <h1 class="form-title">Color</h1>

                    <input class = "form-input form_color" onchange="test(this)"type="color">
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
    tab.addEventListener('click', async () => {
        const target = document.querySelector(tab.dataset.tabTarget)
        tabContent.forEach(tabContent => {
            tabContent.classList.remove('active')
            tabContent.innerHTML = ""
        })

        target.classList.add('active');
        switch (target.id) {

            case "profile":
                const user1 = await user();
                document.getElementById("profile").innerHTML = profile_template(user1)
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
    localStorage.setItem('filter', button)
    load_trackers()


}

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem('theme')) theme_switch()
    else document.body.classList.add(localStorage.getItem('theme'))


    if (!localStorage.getItem('filter'))
        localStorage.setItem('filter', "week")


    load_trackers()
})
