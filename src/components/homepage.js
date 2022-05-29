import React from "react";

import '../css/style-homepage.css';
import '../css/reset.css';
import '../css/theme.css';
import '../css/input-forms.css';
import '../css/nav-bar-btn.css';

import IndexPage from './homepage/index';
import RegistrationPage from './homepage/registration';
import LoginPage from './homepage/login';
import TutorialPage from './homepage/tutorial';
import AboutPage from './homepage/about';
import NavbarTab from "./lib/navbartab";

import ThemeSwitchButton from "./themeswitchbtn";



class Homepage extends React.Component {
  render() {
    return (<>
      <header class="primary-header container">
        <div class="logo-title-button-container">
          <div class="logo-title-container">
            <div class="logo">
              <i class="fas fa-clock"></i>
            </div>
            <div class="brand-title" onClick={`window.location= '/'`}>Track my time</div>
          </div>
          <div class="toggle-btn">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>
        </div>
        <div class="navbar-links">
          <ul class="tabs">
            <NavbarTab idf="home" name="Home" />
            <NavbarTab idf="how-it-work" name="How it works" />
            <NavbarTab idf="about" name="About us" />
            <NavbarTab idf="registration" name="Registration" />
            <NavbarTab idf="log-in" name="Log in" />
            <ThemeSwitchButton />
            <li></li>
          </ul>
        </div>
      </header>

      <div class="page-content container">
        <IndexPage />
        <RegistrationPage />
        <LoginPage />
        <TutorialPage />
        <AboutPage />
      </div>
      <footer class="footer container">
        <ul class="list">
          <li><a href="#">Term</a></li>
          <li><a href="#">Policy</a></li>
          <li><a href="#">Information</a></li>
          <li><a href="#">Site Map</a></li>
        </ul>
        <div class="social">
          <p>Join us</p>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-linkedin"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
        </div>
      </footer>
    </>);
  }
};

export default Homepage;