import React from "react";

import sologan from '../../assets/sologan.PNG';

function AboutPage() {
    return (<>
        <div id="about" data-tab-content>
            <h1>Who are we?</h1>
            <h3>Our story</h3>
            <p>Far away, in Sweden, a group of student need to find an interesting
                project to
                pass a course of cs programme.<br />
                They kept wondering, "What should we do?” and “How could we finish
                it in 1 month?" So, they created a time tracking tool.<br />
                And they named it Track My Time.<br />
            </p>
            <center><img src={sologan} alt="our sologon"
                class="right" /></center>
            <h3>Our team members</h3>
            <p> Hampus Sjöstedt Nilsson: Backend Developer
                Kristian Åkerblom: Supporter
                Marcus Weman: Backend Developer
                Niklas Ling: Frondend Developer
                Xuan Dung Tran: Frontend Developer
            </p>
        </div>
    </>);
}

export default AboutPage;