const tabs = document.querySelectorAll("[data-tab-target]")
const tabContent = document.querySelectorAll("[data-tab-content]");
const toggleButton = document.getElementsByClassName('toggle-btn')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]
const signUpForm = document.getElementById('sign-up-form');
const loginForm = document.getElementById('login-form');
const loginUserName = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const signUpUserName = document.getElementById('sign-up-username');
const signUpFirstName = document.getElementById('firstName');
const signUpLastName = document.getElementById('lastName');
const signUpEmail = document.getElementById('email');
const signUpPassword = document.getElementById('sign-up-password');

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

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const signUpUser = {
        username: signUpUserName.value,
        password: signUpPassword.value,
        first_name: signUpFirstName.value,
        last_name: signUpLastName.value,
        email: signUpEmail.value
    };

    fetch ('/user/signup', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
        },
        body: JSON.stringify(signUpUser),
    })
    .then(res => res.json())
    .then(data => {
        console.log('Success:', data);
      })
    .catch((error) => {
        console.error('Error:', error);
      });
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const loginUser = {
        username: loginUserName.value,
        password: loginPassword.value
    };

    fetch ('/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": 'application/json',
        },
        body: JSON.stringify(loginUser),
    })
    .then(data => {
        if(data.redirected)
            window.location.href = data.url;
      })
    .catch((error) => {
        console.error('Error:', error);
      });

})