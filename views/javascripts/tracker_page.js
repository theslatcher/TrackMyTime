const container = document.getElementById("cards")
const theme_switch = document.getElementById("theme-switch")

const tabs = document.querySelectorAll("[data-tab-target]")
const tabContent = document.querySelectorAll("[data-tab-content]");

const button_add = document.getElementById("bAdd")



const reload = () => {
    const trackers = get_data()
    trackers.forEach(tracker => {
        container.innerHTML += card_template(tracker)
    });
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


document.addEventListener("DOMContentLoaded", reload)

theme_switch.addEventListener("click", () => {
    const body = document.body
    if (body.classList.contains("theme-dark")) {
        body.classList.remove("theme-dark")
        body.classList.add("theme-light")
    }
    else {
        body.classList.remove("theme-light")
        body.classList.add("theme-dark")
    }
})

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget)
        tabContent.forEach(tabContent => {
            tabContent.classList.remove('active')

        })
        target.classList.add('active');

    })
})



