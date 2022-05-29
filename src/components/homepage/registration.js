import React from "react";

import Validation from '../../lib/validation';
import EH from '../../lib/errorhandling';

class RegistrationPage extends React.Component {
    checkFirstName = () => {
        const signUpFirstName = document.getElementById('firstName')
        let valid = false;
        const firstName = signUpFirstName.value.trim()
        if (firstName === '') {
            EH.setError(signUpFirstName, 'First name is required')
        } else {
            if (!Validation.isValidName(firstName)) {
                EH.setError(signUpFirstName, 'your first name should not be/have number')
            } else {
                EH.setSuccess(signUpFirstName);
                valid = true;
            }
        }
        return valid;
    }
    checkLastName = () => {
        const signUpLastName = document.getElementById('lastName')
        let valid = false;
        const lastName = signUpLastName.value.trim()
        if (lastName === '') {
            EH.setError(signUpLastName, 'Last name is required')
        } else {
            if (!Validation.isValidName(lastName)) {
                EH.setError(signUpLastName, 'your last name should not be/have number')
            } else {
                EH.setSuccess(signUpLastName)
                valid = true;
            }
        }
        return valid;
    }
    checkUserName = () => {
        const signUpUserName = document.getElementById('sign-up-username')
        const userNameValue = signUpUserName.value.trim()
        let valid = false;
        if (userNameValue === '' || userNameValue === null) {
            EH.setError(signUpUserName, 'User name is required')
        } else if (!Validation.isValidUserName(userNameValue)) {
            EH.setError(signUpUserName, 'username must have around 4 to 20 characters, alphabetic or/and numeric, . - _')
        } else {
            EH.setSuccess(signUpUserName)
            valid = true;
        }
        return valid;
    };

    checkEmail = () => {
        const signUpEmail = document.getElementById('email')
        const emailValue = signUpEmail.value.trim()
        let valid = false;
        if (emailValue === '') {
            EH.setError(signUpEmail, 'Email is required')
        } else if (!Validation.isValidEmail(emailValue)) {
            EH.setError(signUpEmail, 'Provide a valid email address')
        } else {
            EH.setSuccess(signUpEmail)
            valid = true;
        }
        return valid;
    }

    checkPassword = () => {
        const signUpPassword = document.getElementById('sign-up-password')

        const password = signUpPassword.value;
        let valid = false;
        if (password === '' || password === null) {
            EH.setError(signUpPassword, 'Password is required')
        } else if (!Validation.isValidPassword(password)) {
            EH.setError(signUpPassword, 'only alphabetic or/and numeric characters allowed')
        } else {
            EH.setSuccess(signUpPassword);
            valid = true;
        }
        return valid;
    }

    handleClick = (event) => {
        event.preventDefault();

        let isUsernameValid = this.checkUserName(),
             isEmailValid = this.checkEmail(),
             isPasswordValid = this.checkPassword(),
             isFirstNameValid = this.checkFirstName(),
             isLastNameValid = this.checkLastName();

        let validateInputs = isUsernameValid && isEmailValid && isPasswordValid && isFirstNameValid && isLastNameValid;

        if (validateInputs) {
            const signUpUserName = document.getElementById('sign-up-username')
            const signUpFirstName = document.getElementById('firstName')
            const signUpLastName = document.getElementById('lastName')
            const signUpEmail = document.getElementById('email')
            const signUpPassword = document.getElementById('sign-up-password')

            const signUpUser = {
                username: signUpUserName.value,
                password: signUpPassword.value,
                first_name: signUpFirstName.value,
                last_name: signUpLastName.value,
                email: signUpEmail.value,
            }

            fetch('/api/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signUpUser),
            })
            .then((res) => {
                if (res.ok) {
                    alert('Success create an account');
                }
                else {
                    const error = res.json()
                    if (error.error.errors[0].message.includes('username'))
                        setError(signUpUserName, 'username is already in use');
                    else if (error.error.errors[0].message.includes('email'))
                        setError(signUpEmail, 'email is already in use');
                }
            });
        }
    }

    render() {
        return (<>
            <div id="registration" data-tab-content>
                <div>
                    <h2> Registration</h2>
                    <form id="sign-up-form" onSubmit={this.handleClick}>
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" name="username" id="sign-up-username"
                                placeholder="Username" minLength="4" maxLength="20" />
                            <div class="error"></div>
                        </div>
                        <div class="form-group">
                            <label for="firstName">First Name</label>
                            <input type="text" name="firstName" id="firstName"
                                placeholder="First name" />
                            <div class="error"></div>
                        </div>
                        <div class="form-group">
                            <label for="lastName">Last Name</label>
                            <input type="text" name="lastName" id="lastName"
                                placeholder="Last name" />
                            <div class="error"></div>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" name="Email" id="email"
                                placeholder="name@something.com" />
                            <div class="error"></div>
                        </div>
                        <div class="form-group">
                            <label for="password">Password (6 characters minimum)</label>
                            <input type="password" name="password" id="sign-up-password"
                                placeholder="Your password" minLength="6" />
                            <div class="error"></div>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="submit">
                                <i class="far fa-paper-plane"></i>Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>);
    }
}

export default RegistrationPage;