const tabs = document.querySelectorAll("[data-tab-target]")
const tabContent = document.querySelectorAll("[data-tab-content]");
const toggleButton = document.getElementsByClassName('toggle-btn')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        //select the tab when click on
        const target = document.querySelector(tab.dataset.tabTarget)

        //hidden the tab content
        tabContent.forEach(tabContent => {
            tabContent.classList.remove('active')
        })

        //show the tab content when click on target tab
       
        target.classList.add('active');

    })
})

//show tabs when click to toggle button
toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
    })