import React from "react";

class ThemeSwitchButton extends React.Component {
  handleClick = () => {
    //theme-switch
    const current = localStorage.getItem('theme');
    switch (current) {
      case "theme-dark":
        localStorage.setItem('theme', "theme-light")
        document.getElementById("themeSwitch").classList.remove("fa-moon");
        document.getElementById("themeSwitch").classList.add("fa-sun");
        break
      case "theme-light":
        localStorage.setItem('theme', "theme-dark")
        document.getElementById("themeSwitch").classList.remove("fa-sun");
        document.getElementById("themeSwitch").classList.add("fa-moon");
        break
    }
    document.body.removeAttribute("class")
    document.body.classList.add(localStorage.getItem('theme'))
  }

  componentDidMount() {
    //theme-check
    if (!localStorage.getItem('theme')) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        localStorage.setItem('theme', "theme-dark")
      else
        localStorage.setItem('theme', "theme-light")

      document.body.classList.add(localStorage.getItem('theme'))
    }
    else
      document.body.classList.add(localStorage.getItem('theme'))

    if (localStorage.getItem('theme') === "theme-dark")
      document.getElementById("themeSwitch").classList.add("fa-moon");
    else
      document.getElementById("themeSwitch").classList.add("fa-sun");
  }

  render() {
    return (
      <li class="tab" onClick={this.handleClick}><span id="themeSwitch" class="fas" /></li>
    );
  }
}

export default ThemeSwitchButton;