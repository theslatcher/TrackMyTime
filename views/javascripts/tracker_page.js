const container = document.getElementById("card-container")

const trackers = [
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
]


const reload = () => {
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

document.addEventListener("DOMContentLoaded", reload)