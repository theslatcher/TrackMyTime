const tabs = document.querySelectorAll('[data-tab-target]')
const tabContent = document.querySelectorAll('[data-tab-content]')
const toggleButton = document.getElementsByClassName('toggle-btn')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]
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

    //hidden the tab content
    tabContent.forEach((tabContent) => {
      tabContent.classList.remove('active')
    })

    //show the tab content when click on target tab
    target.classList.add('active')
  })
})

//show tabs when click to toggle button
toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
})

signUpForm.addEventListener('submit', (e) => {
  e.preventDefault()
  let isUsernameValid = checkUserName(),
      isEmailValid = checkEmail(),
      isPasswordValid = checkPassword(),
      isFirstNameValid = checkFirstName(),
      isLastNameValid = checkLastName();

  let validateInputs = isUsernameValid && isEmailValid && isPasswordValid && isFirstNameValid && isLastNameValid;

  if(validateInputs){
    console.log("validate input success");
    const signUpUser = {
      username: signUpUserName.value,
      password: signUpPassword.value,
      first_name: signUpFirstName.value,
      last_name: signUpLastName.value,
      email: signUpEmail.value,
    }
  
    fetch('/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUpUser),
    })
      .then((data) => {
        if(data.ok) alert('Success create an account');
      })
      .catch((error) => {
        console.error('Error:', error)
      })
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
      if(data.ok){
        console.log('Success to login' +data)
        location.href = '/'
      }
      else{
        console.log("error "+data.status);
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
    if (/^[0-9]+$/.test(firstName)) {
      setError(signUpFirstName, 'your first name should not be number')
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
    if (/^[0-9]+$/.test(lastName)) {
      setError(signUpLastName, 'your last name should not be number')
    } else {
      setSuccess(signUpLastName)
      valid= true;
    }
  }
  return valid;
}
const checkUserName = () => {
  const userNameValue = signUpUserName.value.trim()
  let valid = false;
  if(userNameValue === '' || userNameValue === null){
    setError(signUpUserName, 'User name is required')
  }else if (!isValidUserName(userNameValue)){
    setError(signUpUserName, 'invalid username')
  }else{
    setSuccess(signUpUserName)
    valid= true;
  }
  return valid;
};

const checkEmail = () =>{
  const emailValue = signUpEmail.value.trim()
  let valid = false;
  if (emailValue === '') {
    setError(signUpEmail, 'Email is required')
  } else if (!isValidEmail(emailValue)) {
    setError(signUpEmail, 'Provide a valid email address')
  } else {
    setSuccess(signUpEmail)
    valid= true;
  }
  return valid;
}
 
const checkPassword = () => {
  const password = signUpPassword.value;
  let valid = false;
  if(password === '' || password === null){
    setError(signUpPassword, 'Password is required')
  }else if(!isValidPassword(password)){
    setError(signUpPassword, 'invalid password')
  }else{
    setSuccess(signUpPassword);
    valid = true;
  }
  return valid;
}
 
const setError = (element, message) => {
  const inputControl = element.parentElement
  const errorDisplay = inputControl.querySelector('.error')

  errorDisplay.innerText = message
  inputControl.classList.add('error')
  inputControl.classList.remove('success')
}

const setSuccess = (element) => {
  const inputControl = element.parentElement
  const errorDisplay = inputControl.querySelector('.error')

  errorDisplay.innerText = ''
  inputControl.classList.add('success')
  inputControl.classList.remove('error')
}

const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

const isValidUserName = username => {
  const re = /^(?=.{4,20}$)(?:[a-zA-Z\d]+(?:(?:\.|-|_)[a-zA-Z\d])*)+$/;
  return re.test(username);
}

const isValidPassword = password => {
  const re = /^[0-9a-zA-Z]{6,}$/;
  return re.test(password);
}

function theme_switch() {
  const current = localStorage.getItem('theme');
  switch (current) {
      case "theme-dark":
          localStorage.setItem('theme', "theme-light")
          document.getElementById("themeSwitch").classList.remove("fa-sun");
          document.getElementById("themeSwitch").classList.add("fa-moon");
          break
      case "theme-light":
          localStorage.setItem('theme', "theme-dark")
          document.getElementById("themeSwitch").classList.remove("fa-moon");
          document.getElementById("themeSwitch").classList.add("fa-sun");
          break
      default:
          localStorage.setItem('theme', "theme-dark")
          console.log("click case default")
          break

  }
  document.body.removeAttribute("class")
  document.body.classList.add(localStorage.getItem('theme'))
}

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem('theme')) theme_switch()
  else document.body.classList.add(localStorage.getItem('theme'))
});