
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
    if (pass.value.length > 5) {
        return true;
    }
    else {
        pass.setAttribute
        return false;
    }
}

function isDatavalid() {

}
async function editUser() {
    const data = {}
    const username = document.getElementById("username")
    const first_name = document.getElementById("first_name")
    const last_name = document.getElementById("last_name")
    const email = document.getElementById("email")
    const pass = document.getElementById("password")


    if (isNameValid(username) && username.value != "")
        data.username = username.value
    if (isNameValid(first_name) && first_name.value != "")
        data.first_name = first_name.value
    if (isNameValid(last_name) && last_name.value != "")
        data.last_name = last_name.value
    if (isEmailValid(email) && email.value != "")
        data.email = email.value
    if (isPassValid(pass) && pass.value != "")
        data.new_password = pass.value
    //need a better way. pass is shown
    data.curr_password = window.prompt("Enter your current password", "")
    const user1 = await user();
    console.log(data);
    const res = await fetch("http://localhost:3000/user/" + user1.userId,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(data)
        })
    if (res.ok) {
        const user2 = await user();
        document.getElementById("profile").innerHTML = profile_template(user2)
        alert("yaaay, it worked, new info displayed")
    }
    else alert("shitty password")

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