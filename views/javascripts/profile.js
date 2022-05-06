
function isEmailValid(email) {
    const regex = new RegExp(/[^@\s]+@[^@\s]+\.[^@\s]+/);
    if (regex.test(email.value)) {
        return true;
    }
    else {
        alert(email.value)
        return false;
    }
}
function isNameValid(myName) {
    const regex = new RegExp(/^([^0-9]*)$/);

    if (regex.test(myName.value)) {
        return true;
    }
    else {
        alert(myName.value)
        return false;
    }
}
function isPassValid(pass) {
    if (!pass.value || pass.value.length < 6) {
        return true;
    }
    else {
        pass.setAttribute
        return false;
    }
}
async function editUser() {
    let username = document.getElementById("username")
    if (!username.value)
        username.value = document.getElementById("username").getAttribute("placeholder")
    let first_name = document.getElementById("first_name")
    if (!first_name.value)
        first_name.value = document.getElementById("first_name").getAttribute("placeholder")
    let last_name = document.getElementById("last_name")
    if (!last_name.value)
        last_name.value = document.getElementById('last_name').getAttribute("placeholder")
    let email = document.getElementById("email")
    if (!email.value)
        email.value = document.getElementById("email").getAttribute("placeholder")
    let pass = document.getElementById("password")


    if ((isNameValid(username) && isNameValid(first_name) && isNameValid(last_name) && isEmailValid(email) && isPassValid(pass))) {
        const user1 = await user();
        const password = window.prompt("Enter your current password", "");
        //todo check if pass is good

        const user = {
            "username": username.value,
            "first_name": first_name.value,
            "last_name": last_name.value,
            "email": email.value
        }
        if (pass) user.password = pass

        console.log(user);
        await fetch("http://localhost:3000/user/" + user1.userId,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(user)
            })
        const user2 = await user();
        document.getElementById("profile").innerHTML = profile_template(user2)
    }
    else console.log("false");
}
function profile_template(user1) {
    return (`<h1>Profile page</h1>
            <form id="profile-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="${user1.username}"
                        />
                    
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        id="first_name"
                        placeholder="${user1.first_name}"
                        />
                    
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        id="last_name"
                        placeholder="${user1.last_name}"
                        />
                   
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input
                        type="email"
                        name="Email"
                        id="email"
                        placeholder="${user1.email}"
                        />
                <div class="form-group">
                    <label for="password">New Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="******"
                        />
                <div class="button-group">
                <button onclick="logout()"type="button" class="negative">
                     Log out
                    </button>
                <button type="button" onclick="theme_switch()"id="theme-switch">theme</button>
                    <button onclick="editUser()"type="button" class="possetive">
                     save
                    </button>
                </div>
             </form>
`)
}