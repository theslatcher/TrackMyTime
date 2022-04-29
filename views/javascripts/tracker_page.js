const tabs = document.querySelectorAll("[data-tab-target]")
const tabContent = document.querySelectorAll("[data-tab-content]");

const profile_container = document.getElementById("profile")

const load_trackers = () => {
    document.getElementById('trackers').innerHTML += trackerButtons_template()
    const trackers = get_data()
    trackers.forEach(tracker => {
        document.getElementById("cards").innerHTML += card_template(tracker)
    });
}
const clearX = () => {
    document.getElementById('trackers').innerHTML = ""
    load_trackers()
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


function card_template(tracker) {
    return (`
        
             <div class="card" style="${"border: 3px solid " + tracker.color} ">
                <h2> ${tracker.name}</h2>
                <h1>${tracker.current + "hrs"}</h1>
                <h2>${"Goal is " + tracker.goal}</h2>
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
    <form action="" class="card" style=" border: 3px solid var(--font-color)">
                <div class="form_title">
                    <h2>Create New</h2>
                    
                </div>
                <div class="form_element">
                    <label for="">name?</label>
                    <input type="text">
                </div>

                <div class="form_element">
                    <label for="">goal?</label>
                    <input type="number">
                </div>
                <div class="form_element">
                    <label for="">color?</label>
                    <input type="color">

                </div>
                <div class="form_element">
                    <button class="negative form_button" type="button" onclick="clearX()" >x</button>
                    <button class="possetive form_button" type="button">(y)</button>
                    </div>

            </form>`)
}
function get_data() {
    return ([
        { name: "Study", color: "Red", current: 20, goal: 40 },
        { name: "Study", color: "Blue", current: 20, goal: 40 },
        { name: "Study", color: "Yellow", current: 20, goal: 40 },
        { name: "Study", color: "Purple", current: 20, goal: 40 },
        { name: "Study", color: "Red", current: 20, goal: 40 },
        { name: "Study", color: "Green", current: 20, goal: 40 },
        { name: "Study", color: "#EBFF00", current: 20, goal: 40 },
        { name: "Study", color: "Blue", current: 20, goal: 40 },
        { name: "Study", color: "Red", current: 20, goal: 40 },
        { name: "Study", color: "Blue", current: 20, goal: 40 },
        { name: "Study", color: "Red", current: 20, goal: 40 },
        { name: "Study", color: "Blue", current: 20, goal: 40 },
    ])
}

function theme_switch() {
    const body = document.body
    if (body.classList.contains("theme-dark")) {
        body.classList.remove("theme-dark")
        body.classList.add("theme-light")
    }
    else {
        body.classList.remove("theme-light")
        body.classList.add("theme-dark")
    }
}

document.addEventListener("DOMContentLoaded", load_trackers)


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
                profile_container.innerHTML = profile_template()
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