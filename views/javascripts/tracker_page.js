
const tabs = document.querySelectorAll('[data-tab-target]')
const tabContent = document.querySelectorAll('[data-tab-content]');
async function get_user() {
    const res = await fetch('/user/' + userId())
    const user = await res.json()
    return (user)
}
const userId = () => {
    const data = JSON.parse(localStorage.getItem('user_details'));
    return data.user.userId
}
const load_tracker_section = async () => {
    generate_buttons()
    generate_trackers_html()
}
function generate_buttons() {
    document.getElementById('trackers').innerHTML = ''
    document.getElementById('trackers').innerHTML += trackerButtons_template()
    document.getElementById(localStorage.getItem('filter')).classList.add('bActive')
}
async function generate_trackers_html() {
    const trackers = await get_trackers()
    let html = ""
    trackers.forEach(tracker => {
        html += card_template(tracker)
    })
    document.getElementById('cards').innerHTML = html
    return html
}
const get_trackers = async () => {
    const url = new URL(window.location.href + 'task/user/' + userId())
    url.searchParams.append(localStorage.getItem('filter'), new Date())
    const res = await fetch(url)
    const trackers = await res.json()
    return trackers
}
const get_a_tracker = async (trackerid) => {
    const url = new URL(window.location.href + 'task/' + trackerid)
    const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    url.searchParams.append(localStorage.getItem('filter'), date)
    const res = await fetch(url)
    const new_tracker = await res.json()
    return new_tracker
}
const create_tracker = async () => {
    const name = document.getElementById('create_new_card').children[0].value
    const goal = document.getElementById('create_new_card').children[2].value
    if (name.length < 1)
        alert('name of tracker cant be empty')
    else if (goal.length < 1)
        alert('goal cant be empty')
    else {
        const id = userId()
        const res = await fetch('/task', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                'name': name,
                'goal': goal,
                'color': document.getElementById('create_new_card').children[4].value,
                'userId': id
            })
        })
        const tracker = await res.json()
        await fetch('/time', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                'trackerid': tracker.body.trackerid,
                'totaltime': 0,
                'dayofyear': new Date()
            })
        }
        )
        generate_trackers_html()
    }
}
const delete_tracker = async (id, name) => {
    if (confirm('Do you want to delete ' + name)) {
        await fetch('/time', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify({
                'trackerid': id
            })
        }
        )
        await fetch('/task', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify({
                'trackerid': id
            })
        }
        )
        document.getElementById("cards").removeChild(document.getElementById(id))
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
function cancel_new_card() {
    document.getElementById('cards').removeChild(document.getElementById('create_new_card'))
}
async function add_new_time(id) {
    const card = document.getElementById(id)
    const h = card.children[3].value
    const min = (card.children[5].value / 60)
    const time = Number(h) + Number(min)
    await fetch('/time', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            'trackerid': id,
            'totaltime': time,
            'dayofyear': new Date()
        })
    }
    )
    reload_a_card(card.id)
    toggle_add_time(card.id)
}
async function save_tracker(id) {
    await fetch('/task/' + id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({
            'name': document.getElementById(id).children[0].value,
            'goal': document.getElementById(id).querySelectorAll('.form-input')[0].value,
            'color': document.getElementById(id).querySelectorAll('.form-input')[1].value
        })

    })
    reload_a_card(id)
}
async function reload_a_card(id) {
    const tracker = await get_a_tracker(id)
    const old_card = document.getElementById(id)
    const new_card = document.createElement("somethingfun");
    new_card.innerHTML = card_template(tracker)
    old_card.parentElement.replaceChild(new_card.children[0], old_card)
}
async function toggle_edit_tracker(id) {
    const tracker = await get_a_tracker(id)
    const old_card = document.getElementById(id)
    const new_card = document.createElement("cool");
    new_card.innerHTML = edit_tracker(tracker)
    old_card.parentElement.replaceChild(new_card.children[0], old_card)
    toggle_add_time(id)
}
function toggle_add_time(id) {
    $(`#${id}`).find('.card-hidden').toggle('card-hidden');
}
async function card_form_toggle(e, button) {
    const menu = $('#card-context-menu')
    let open = false
    if (menu.attr('task-id') != button.parentElement.id)
        open = true
    menu.attr('task-id', button.parentElement.id)
    menu.attr('task-name', button.parentElement.getAttribute('task-name'))
    if (menu.is(':visible'))
        menu.hide();
    else
        open = true
    if (open) {
        menu.show()
        const menu_pos = { x: $(button).position().left, y: $(button).position().top + $(button).height() }
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
        e.stopImmediatePropagation();
        document.addEventListener('click', ctx_menu_listener)
    }
}
function validateHrs(number, max) {

    number = parseInt(number)
    if (!isNaN(number)) {
        number
        if (number < 1) {
            number = 0
        } else if (number > max) {
            number = max
        }
    }
    else number = 0
    return number
}
function toggle_color(color) {
    document.getElementById(color.parentElement.id).setAttribute('style', 'border: 3px solid' + color.value)
    document.getElementById('newgoal').setAttribute('style', 'border-bottom: 1px solid' + color.value)
}
function get_data_from_form() {
    const data = {}
    const username = document.getElementById('username')
    const first_name = document.getElementById('first_name')
    const last_name = document.getElementById('last_name')
    const email = document.getElementById('email')
    const pass = document.getElementById('password')
    let validInput = true
    if (username.value != '') {
        if (isValidUserName(username.value.trim())) {
            data.username = username.value
            setSuccess(username)
        }
        else {
            setError(username, 'username must have around 4 to 20 characters, alphabetic or/and numeric')
            validInput = false
        }
    }
    if (first_name.value != '') {
        if (isValidName(first_name.value.trim())) {
            data.first_name = first_name.value
            setSuccess(first_name)
        }
        else {
            setError(first_name, 'your first name should not be / have number')
            validInput = false
        }
    }
    if (last_name.value != '') {
        if (isValidName(last_name.value.trim())) {
            data.last_name = last_name.value
            setSuccess(last_name)
        }
        else {
            setError(last_name, 'your last name should not be / have number')
            validInput = false
        }
    }
    if (email.value != '') {
        if (isValidEmail(email.value)) {
            data.email = email.value
            setSuccess(email)
        }
        else {
            setError(email, 'Provide a valid email address')
            validInput = false
        }
    }
    if (pass.value != '') {
        if (isValidPassword(pass.value)) {
            data.pass = pass.value
            setSuccess(pass)
        }
        else {
            setError(pass, 'only alphabetic or/and numeric characters allowed')
            validInput = false
        }
    }
    data.valid = validInput
    return data
}
async function editUser() {
    const data = get_data_from_form()
    const current_pass = document.getElementById('current_password')
    if (Object.entries(data).length > 1 && data.valid) {
        data.curr_password = current_pass.value
        const res = await fetch('/user/' + userId(),
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(data)
            })
        if (res.ok) {
            location.href = '/'
        }
        else {
            const error = await res.json()
            if (error.error.errors) {
                if (error.error.errors[0].message.includes('username'))
                    setError(username, 'username is already in use')
                else if (error.error.errors[0].message.includes('email'))
                    setError(email, 'email is already in use')
            }
            else
                setError(current_pass, 'password not accepted')
        }
    }
}
tabs.forEach(tab => {
    tab.addEventListener('click', async () => {
        const target = document.querySelector(tab.dataset.tabTarget)
        tabContent.forEach(tabContent => {
            tabContent.classList.remove('active')
            tabContent.innerHTML = ''
        })
        target.classList.add('active');
        switch (target.id) {
            case 'profile':
                document.getElementById('profile').innerHTML = profile_template(await get_user())
                document.getElementById('profile-form').addEventListener('submit', (e) => {
                    e.preventDefault()
                    editUser()
                })
                break
            case 'trackers':
                load_tracker_section()
                break
            default:
                document.getElementById('graphs').innerHTML = graph_template_container()
                loadGraphs();
                break
        }
        if (navbarLinks.classList.contains('active'))
            navbarLinks.classList.toggle('active')
    })
})
function add_card() {
    if (!document.getElementById('create_new_card'))
        document.getElementById('cards').innerHTML = form_template() + document.getElementById('cards').innerHTML
    else cancel_new_card()
}
function filterButton(button) {
    button.parentElement.querySelector('.bActive').classList.toggle('bActive')
    localStorage.setItem('filter', button.id)
    button.classList.add('bActive')
    generate_trackers_html()
}
document.addEventListener('DOMContentLoaded', () => {
    theme_check()
    if (!localStorage.getItem('filter'))
        localStorage.setItem('filter', 'd')
    load_tracker_section()
})