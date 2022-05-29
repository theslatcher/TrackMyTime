import React from "react";

class LoginPage extends React.Component {
    handleClick = (event) => {
        event.preventDefault();

        const loginUserName = document.getElementById('login-username')
        const loginPassword = document.getElementById('login-password')

        const loginUser = {
            username: loginUserName.value,
            password: loginPassword.value
        }

        fetch('/api/user/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginUser)
        })
            .then((data) => {
                if (data.ok) {
                    data.json().then(user_details => {
                        localStorage.setItem('user_details', JSON.stringify(user_details))
                        location.href = '/user'
                    })
                        .catch((error) => {
                            console.error('Error:', error)
                        })
                }
                else {
                    console.error('Error:', data);
                    alert("invalid username or password");
                }
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }

    render() {
        return (<>
            <div id="log-in" data-tab-content>
                <h2>User Login</h2>
                <form id="login-form" onSubmit={this.handleClick}>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" name="username" id="login-username"
                            placeholder="Username" minLength="4" maxLength="20" required />
                        <div class="error"></div>
                    </div>
                    <div class="form-group">
                        <label for="password">Password (6 characters minimum)</label>
                        <input type="password" name="password" id="login-password"
                            placeholder="Your password" minLength="6" required />
                        <div class="error"></div>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="submit">
                            <i class="far fa-paper-plane"></i>Login
                        </button>
                    </div>

                </form>
            </div>
        </>);
    }
}

export default LoginPage;