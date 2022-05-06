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

    const res = await fetch('http://localhost:3000/user/' + data.user.userId)
    const user1 = await res.json()
    return (user1)
}

const load_trackers = async () => {
    const user1 = await user();
    document.getElementById('trackers').innerHTML = ""
    document.getElementById('trackers').innerHTML += trackerButtons_template()
    document.getElementById(localStorage.getItem('filter')).classList.add("bActive")


    const url = new URL('http://localhost:3000/task/user/' + user1.userId)
    const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    url.searchParams.append(localStorage.getItem('filter'), date)






    const res = await fetch(url)
    const trackers = await res.json()
    for (let index = 0; index < trackers.length; index++) {


        document.getElementById("cards").innerHTML += card_template(trackers[index])
        const opt = document.createElement('option');
        opt.value = trackers[index].trackerid;
        opt.innerHTML = trackers[index].name;
        document.getElementById("select").appendChild(opt);
    }
}
function loadScript(url) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

const create_tracker = async () => {

    //todo validate?

    const user1 = await user();
    const res = await fetch("http://localhost:3000/task", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "name": document.getElementById('create_new_card').children[0].value,
            "goal": document.getElementById('create_new_card').children[2].value,
            "color": document.getElementById('create_new_card').children[4].value,
            "userId": user1.userId
        })
    }
    )
    console.log(res);

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



async function add_new_time(button) {
    const h = button.parentElement.children[3].value
    const min = (button.parentElement.children[5].value / 60)
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
    let h = Math.floor(tracker.currenttime)
    let min = Math.round((tracker.currenttime - h) * 60)
    if (min == 60) {
        h++
        min = 0
    }
    if (min == 0) min = ""
    else min += "m"
    return (`
        
             <div class="card" style="${"border: 3px solid " + tracker.color}" id="${tracker.trackerid}">
                <h2 class = ""> ${tracker.name}</h2>
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
            <button onclick="filterButton(id)" id="d">Day</button>
            <button onclick="filterButton(id)" id="w" >Week</button>
            <button onclick="filterButton(id)" id="m">Month</button>
            <button onclick="filterButton(id)" id="y">Year</button>
        </div>


        <div class="add-remove-tracker">
            <div class="delete add-remove-tracker">
                <select class="select" id="select">
                    
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
        localStorage.setItem('filter', "w")


    load_trackers()
})
