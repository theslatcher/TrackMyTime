import React from "react";

import registrationImg from '../../assets/registration.PNG';
import successImg from '../../assets/success_msg.PNG';
import loginImg from '../../assets/login.PNG';
import errorLgnImg from '../../assets/error-lgn-msg.PNG';
import dashboardImg from '../../assets/dashboard-page.PNG';
import cardImg from '../../assets/card-example.PNG';
import graphImg from '../../assets/graph.PNG';
import lightImg from '../../assets/light-theme.PNG';
import darkImg from '../../assets/dark-theme.PNG';

function TutorialPage() {
    return (<>
        <div id="how-it-work" class="manual" data-tab-content>
            <h1>Manual</h1>
            <h3>Registration and login</h3>
            <center><img src={registrationImg} alt="registration form" /></center>
            <p>First you need an account. The username should have around 4 to 20
                characters, you are free to choose among alphabetic and/or numeric
                characters, only special characters are "- _ ." allowed. Your first
                name and last name should not contain any number. Valid email address
                and password are also required.
                When your account is successfully created, a message will appear </p><center><img
                    src={successImg} alt="successMsg" /></center>.<p>Then
                        you need to switch to login page to access to your dashboard.</p><center><img
                            src={loginImg} alt="login form" /></center><p> If your
                                username and password are matched, browser will automatically redirect
                                to dashboard page, otherwise a error message will show.</p><center><img
                                    src={errorLgnImg} alt="error login msg" /></center>
            <h3>Track time</h3>
            <center><img src={dashboardImg} alt="dashboard" /></center>
            <p>To add a task tracker, press task button. A tracker card will appear,
                you can enter task name, daily goal and color. When everything is
                done, click to a tick symbol button. The card will save to the board,
                you can create as many tracker cards as you want.</p> <center><img
                    src={cardImg} alt="successMsg" /></center>
            <p> Whenever you finish your task, click the triple bar and input time
                then click tick button. The progress bar will show how far you reach
                your goal. You can edit the tracker card name, goal, color by clicking
                to edit, or delete the card when you reach your goal. By choosing
                week, month and year button,
                you can see different cards and how far you progress to your goal.
                Click to graphs bar in the navbar, you can see pie chart and line
                chart to get visual overview of your tracker time.</p> <center><img
                    src={graphImg} alt="graph" /></center> <p> In profile page,
                        you can edit your account On the far right side of navbar, the symbol
                        will switch to
                        either dark or light theme when being clicked to.</p><center><img
                            src={lightImg} alt="light theme" /></center><center><img
                                src={darkImg} alt="dark theme" /></center> <p>The
                                    logout button will sign out your account and redirect to homepage.
            </p>
        </div>
    </>);
}

export default TutorialPage;