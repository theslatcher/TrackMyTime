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

    const res = await fetch('/user/' + data.user.userId)
    const user1 = await res.json()
    return (user1)
}

const load_trackers = async () => {
    const user1 = await user();
    document.getElementById('trackers').innerHTML = ""
    document.getElementById('trackers').innerHTML += trackerButtons_template()
    document.getElementById(localStorage.getItem('filter')).classList.add("bActive")


    const url = new URL(window.location.href + 'task/user/' + user1.userId)
    const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    url.searchParams.append(localStorage.getItem('filter'), date)
    const res = await fetch(url)
    const trackers = await res.json()
    for (let index = 0; index < trackers.length; index++) {
        document.getElementById("cards").innerHTML += card_template(trackers[index])

    }
}


const create_tracker = async () => {

    const name = document.getElementById('create_new_card').children[0].value
    const goal = document.getElementById('create_new_card').children[2].value

    if (name.length < 1)
        alert("name of tracker cant be empty")
    else if (goal.length < 1)
        alert("goal cant be empty")

    else {
        const user1 = await user();
        const res = await fetch("/task", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                "name": name,
                "goal": goal,
                "color": document.getElementById('create_new_card').children[4].value,
                "userId": user1.userId
            })
        }

        )
        const tracker = await res.json()
        await fetch("/time", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                "trackerid": tracker.body.trackerid,
                "totaltime": 0,
                "dayofyear": new Date()
            })
        }
        )
        load_trackers()

    }
}


const delete_tracker = async (id, name) => {
    if (confirm("Do you want to delete " + name)) {
        await fetch("/time", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify({
                "trackerid": id
            })
        }
        )
        await fetch("/task", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify({
                "trackerid": id
            })
        }
        )
        load_trackers()
    }

}
function daysInYear() {
    return isLeapYear(new Date().getFullYear()) ? 366 : 365
}
function daysInMonth() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    return new Date(year, month, 0).getDate()
}
function isLeapYear(year) {
    return (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
}
function calc_goal(goal) {
    let new_goal = 0
    switch (localStorage.getItem('filter')) {
        case "w":
            new_goal = goal * 7
            break
        case "m":
            new_goal = goal * daysInMonth()
            break
        case "y":
            new_goal = goal * daysInYear()
            break
        default: new_goal = goal
    }
    return new_goal
}


async function add_new_time(button) {
    const h = button.parentElement.children[3].value
    const min = (button.parentElement.children[5].value / 60)
    const time = Number(h) + Number(min)
    await fetch("/time", {
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
    button.parentElement.parentElement.children[3].classList.toggle("card-hidden");
    button.parentElement.parentElement.children[5].classList.toggle("card-hidden");
    button.parentElement.parentElement.children[7].classList.toggle("card-hidden");
}








function test(some) {
    document.getElementById("create_new_card").setAttribute("style", "border: 3px solid" + some.value)
    document.getElementById("newgoal").setAttribute("style", "border-bottom: 1px solid" + some.value)

}




async function editUser() {
    const data = {}
    const username = document.getElementById("username")
    const first_name = document.getElementById("first_name")
    const last_name = document.getElementById("last_name")
    const email = document.getElementById("email")
    const pass = document.getElementById("password")
    const current_pass = document.getElementById("current_password")

    if (username.value != "") {
        if (isValidUserName(username.value)) data.username = username.value
        else setError(username, 'username must have around 4 to 20 characters, alphabetic or/and numeric')
    }
    if (first_name.value != "") {
        if (isValidName(first_name.value)) data.first_name = first_name.value
        else setError(first_name, 'your first name should not be / have number')
    }

    if (last_name.value != "") {
        if (isValidName(last_name.value)) data.last_name = last_name.value
        else setError(last_name, 'your last name should not be / have number')
    }
    if (email.value != "") {
        if (isValidEmail(email.value)) data.email = email.value
        else setError(email, 'username must have around 4 to 20 characters, alphabetic or/and numeric')
    }
    if (pass.value != "") {
        if (isValidPassword(pass.value)) data.pass = pass.value
        else setError(pass, 'only alphabetic or/and numeric characters allowed') //why?
    }

    if (Object.entries(data).length > 0) {
        data.curr_password = current_pass.value
        const user1 = await user();
        const res = await fetch("/user/" + user1.userId,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(data)
            })
        if (res.ok) {
            location.href = '/' //should i stay or should i go?

        }
        else setError(current_pass, 'invalid password')
    }
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
                document.getElementById('profile-form').addEventListener("submit", (e) => {
                    e.preventDefault()
                    editUser()
                })
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
    theme_check()

    if (!localStorage.getItem('filter'))
        localStorage.setItem('filter', "w")


    load_trackers()
})
