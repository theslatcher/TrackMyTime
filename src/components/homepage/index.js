import React from "react";

import img1Home from '../../assets/img1-home.svg';
import img2Home from '../../assets/img2-home.svg';
import img3Home from '../../assets/img3-home.svg';

function IndexPage() {
    return (<>
        <div id="home" data-tab-content class="active">
            <h1>Get started</h1>
            <div class="guide-container">
                <div class="guide-item">
                    <div class="guide-content">
                        <div class="number"><h1>1</h1></div>
                        <h2>Register</h2>
                        <p>Create your account</p>
                        <center><img src={img1Home} alt="register" /></center>
                    </div>
                </div>

                <div class="guide-item">
                    <div class="guide-content">
                        <div class number> <h1>2</h1></div>
                        <h2>Fill in information</h2>
                        <p>Your personal profile and what things need to be track</p>
                        <center><img src={img2Home} alt="fill in form" /></center>
                    </div>
                </div>

                <div class="guide-item">
                    <div class="guide-content">
                        <div class number> <h1>3</h1></div>
                        <h2>Setup your target</h2>
                        <p>Organize your schedule </p>
                        <center><img src={img3Home} alt="setup targets" /></center>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default IndexPage;