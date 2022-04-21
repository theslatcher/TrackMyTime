const tabs = document.querySelectorAll("[data-tab-target]")
const tabContent = document.querySelectorAll("[data-tab-content]");

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

    //     //loop through 'li' items and remove 'active' class
    //     tabs.forEach(tab => {
    //           tab.classList.remove('active');
    //       })

    //    //add 'active' class to clicked 'li' item
    //     e.target.classList.add("active");
    })
})