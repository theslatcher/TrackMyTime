const tabs = document.querySelectorAll('[data-tab-target]')
const tabContent = document.querySelectorAll('[data-tab-content]')

const signUpForm = document.getElementById('sign-up-form')
const loginForm = document.getElementById('login-form')
const loginUserName = document.getElementById('login-username')
const loginPassword = document.getElementById('login-password')
const signUpUserName = document.getElementById('sign-up-username')
const signUpFirstName = document.getElementById('firstName')
const signUpLastName = document.getElementById('lastName')
const signUpEmail = document.getElementById('email')
const signUpPassword = document.getElementById('sign-up-password')

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    //select the tab when click on
    const target = document.querySelector(tab.dataset.tabTarget)

    //hide the tab content
    tabContent.forEach((tabContent) => {
      tabContent.classList.remove('active')
    })

    //show the tab content when click on target tab
    target.classList.add('active')
    if (navbarLinks.classList.contains('active'))
      navbarLinks.classList.toggle('active')
  })

}
)

//show tabs when click to toggle button


signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  let isUsernameValid = checkUserName(),
    isEmailValid = checkEmail(),
    isPasswordValid = checkPassword(),
    isFirstNameValid = checkFirstName(),
    isLastNameValid = checkLastName();

  let validateInputs = isUsernameValid && isEmailValid && isPasswordValid && isFirstNameValid && isLastNameValid;

  if (validateInputs) {
    console.log("validate input success");
    const signUpUser = {
      username: signUpUserName.value,
      password: signUpPassword.value,
      first_name: signUpFirstName.value,
      last_name: signUpLastName.value,
      email: signUpEmail.value,
    }

    const res = await fetch('/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUpUser),
    })
    if (res.ok) {
      alert('Success create an account');
    }
    else {
      const error = await res.json()
      if (error.error.errors[0].message.includes('username'))
        setError(signUpUserName, 'username is already in use')
      else if (error.error.errors[0].message.includes('email'))
        setError(signUpEmail, 'email is already in use')
    }
  }

}
)

loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const loginUser = {
    username: loginUserName.value,
    password: loginPassword.value,
  }

  fetch('/user/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginUser),
  })
    .then((data) => {
      if (data.ok) {
        data.json().then(user_details => {
          localStorage.setItem('user_details', JSON.stringify(user_details))
          location.href = '/'
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
})

const checkFirstName = () => {
  let valid = false;
  const firstName = signUpFirstName.value.trim()
  if (firstName === '') {
    setError(signUpFirstName, 'First name is required')
  } else {
    if (!isValidName(firstName)) {
      setError(signUpFirstName, 'your first name should not be/have number')
    } else {
      setSuccess(signUpFirstName);
      valid = true;
    }
  }
  return valid;
}
const checkLastName = () => {
  let valid = false;
  const lastName = signUpLastName.value.trim()
  if (lastName === '') {
    setError(signUpLastName, 'Last name is required')
  } else {
    if (!isValidName(lastName)) {
      setError(signUpLastName, 'your last name should not be/have number')
    } else {
      setSuccess(signUpLastName)
      valid = true;
    }
  }
  return valid;
}
const checkUserName = () => {
  const userNameValue = signUpUserName.value.trim()
  let valid = false;
  if (userNameValue === '' || userNameValue === null) {
    setError(signUpUserName, 'User name is required')
  } else if (!isValidUserName(userNameValue)) {
    setError(signUpUserName, 'username must have around 4 to 20 characters, alphabetic or/and numeric, . - _')
  } else {
    setSuccess(signUpUserName)
    valid = true;
  }
  return valid;
};

const checkEmail = () => {
  const emailValue = signUpEmail.value.trim()
  let valid = false;
  if (emailValue === '') {
    setError(signUpEmail, 'Email is required')
  } else if (!isValidEmail(emailValue)) {
    setError(signUpEmail, 'Provide a valid email address')
  } else {
    setSuccess(signUpEmail)
    valid = true;
  }
  return valid;
}

const checkPassword = () => {
  const password = signUpPassword.value;
  let valid = false;
  if (password === '' || password === null) {
    setError(signUpPassword, 'Password is required')
  } else if (!isValidPassword(password)) {
    setError(signUpPassword, 'only alphabetic or/and numeric characters allowed')
  } else {
    setSuccess(signUpPassword);
    valid = true;
  }
  return valid;
}





document.addEventListener("DOMContentLoaded", () => {
  theme_check()
});