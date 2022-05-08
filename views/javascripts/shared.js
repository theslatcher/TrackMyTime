
const toggleButton = document.getElementsByClassName('toggle-btn')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

function theme_switch() {
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
        default:
            localStorage.setItem('theme', "theme-dark")
            console.log("click case default")
            break

    }
    document.body.removeAttribute("class")
    document.body.classList.add(localStorage.getItem('theme'))
}

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})

async function logout() {
    await fetch('http://localhost:3000/user/signout')
    location.href = '/'
}

function theme_check() {
    if (!localStorage.getItem('theme')) theme_switch()
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