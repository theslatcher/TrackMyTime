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
            location.href = '/' //should i stay or should i go?

        }
        else setError(current_pass, 'invalid password')
    }
}


function profile_template(user1) {
    return (`<h2>Edit profile</h2>
            <form  id="profile-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="${user1.username}"
                        />
                    <div class="error"></div>

                </div>

                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        id="first_name"
                        placeholder="${user1.first_name}"
                        />
                <div class="error"></div>

                </div>

                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        id="last_name"
                        placeholder="${user1.last_name}"
                        />
                <div class="error"></div>
                </div>

                   
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input
                        type="email"
                        name="Email"
                        id="email"
                        placeholder="${user1.email}"
                        />
                    <div class="error"></div>
                </div>

                <div class="form-group">
                    <label for="password">New Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="******"
                        />
                    <div class="error"></div>
                </div>
                <div class="form-group">
                    <label for="current password">Current Password*</label>
                    <input
                        type="password"
                        name="current password"
                        id="current_password"
                        placeholder="******"
                        required
                        />
                    <div class="error"></div>
                </div>
                <div class="button-group">
              
                    <button type="submit" class="submit" id="submit"> 
                    <i class="far fa-paper-plane"></i>
                     Send
                    </button>
                </div>
             </form>
`)
}