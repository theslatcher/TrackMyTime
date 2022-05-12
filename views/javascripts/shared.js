
const toggleButton = document.getElementsByClassName('toggle-btn')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

async function theme_switch() {
    const current = localStorage.getItem('theme');
    switch (current) {
        case "theme-dark":
            localStorage.setItem('theme', "theme-light")
            document.getElementById("themeSwitch").classList.remove("fa-moon");
            document.getElementById("themeSwitch").classList.add("fa-sun");
            break
        case "theme-light":
            localStorage.setItem('theme', "theme-dark")
            document.getElementById("themeSwitch").classList.remove("fa-sun");
            document.getElementById("themeSwitch").classList.add("fa-moon");
            break

    }
    document.body.removeAttribute("class")
    document.body.classList.add(localStorage.getItem('theme'))
    if (document.getElementById('graphs'))
        if (document.getElementById('graphs').classList.contains('active'))
            loadGraphs(await user())

}

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})

async function logout() {
    localStorage.removeItem('user_details')
    await fetch('/user/signout')
    location.href = '/'
}

function theme_check() {
    if (!localStorage.getItem('theme')) {
        if (window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches) {
            localStorage.setItem('theme', "theme-dark")


        }
        else {
            localStorage.setItem('theme', "theme-light")
        }
        document.body.classList.add(localStorage.getItem('theme'))

    }
    else document.body.classList.add(localStorage.getItem('theme'))
    if (localStorage.getItem('theme') === "theme-dark") document.getElementById("themeSwitch").classList.add("fa-moon");
    if (localStorage.getItem('theme') === "theme-light") document.getElementById("themeSwitch").classList.add("fa-sun");
}


function calc_time_from_db(currenttime) {
    let h = Math.floor(currenttime)
    let min = Math.round((currenttime - h) * 60)
    if (min == 60) {
        h++
        min = 0
    }


    return { "hours": h, "min": min }
}


const setError = (element, message) => {
    const inputControl = element.parentElement
    const errorDisplay = inputControl.querySelector('.error')

    errorDisplay.innerText = message
    inputControl.classList.add('error')
    inputControl.classList.remove('success')
}

const setSuccess = (element) => {
    const inputControl = element.parentElement
    const errorDisplay = inputControl.querySelector('.error')

    errorDisplay.innerText = ''
    inputControl.classList.add('success')
    inputControl.classList.remove('error')
}

const isValidName = (name) => {
    const re =
        /^[0-9]+$/
    return re.test(String(name).toLowerCase())
}


const isValidEmail = (email) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

const isValidUserName = username => {
    const re = /^(?=.{4,20}$)(?:[a-zA-Z\d]+(?:(?:\.|-|_)[a-zA-Z\d])*)+$/;
    return re.test(username);
}

const isValidPassword = password => {
    const re = /^[0-9a-zA-Z]{6,}$/;
    return re.test(password);
}