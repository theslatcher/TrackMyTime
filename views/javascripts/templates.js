
function card_template(tracker) {
    const time = calc_time_from_db(tracker.currenttime)
    const goal = calc_goal(tracker.goal)
    const percentage = Math.round(((tracker.currenttime / goal) * 100))
    return (`
        
             <div class="card" style="${"border: 3px solid " + tracker.color}" id="${tracker.trackerid}" task-name="${tracker.name}">
                <h2 class = ""> ${tracker.name}</h2>
                    <i class="fas fa-bars card-button" onclick="card_form_toggle(event, this)"></i>
               
                <h1 class="">${time.hours + "h"}</h1>
                <input style="${"border-bottom: 1px solid " + tracker.color}" class="form-input card-hidden" type="number" min="0" max="24" placeholder="hrs" oninput="this.value=validateHrs(this.value,this.max)">
                <h1 class="">${time.min + "m"}</h1>

                <input style="${"border-bottom: 1px solid " + tracker.color}" class="form-input card-hidden" type="number" min="0" max="59" placeholder="min" oninput="this.value=validateHrs(this.value,this.max)">
                 <div class="card-goal">
                 <h2>${percentage}%</h2>
                <progress class="progress"value="${tracker.currenttime}" max="${goal}" >
                </progress>
                </div>
                <div class="addtime_buttons">
                    <i class="far fa-window-close card-button card-hidden" onclick="toggle_add_time(${tracker.trackerid})"></i>
                    <i class="far fa-check-square card-button card-hidden" onclick="add_new_time(${tracker.trackerid})"></i>
                </div>
            </div>
    `)

}


function graph_template_container() {
    return (`<canvas id='chart0' class='graph-canvas'></canvas><canvas id='chart1' class='graph-canvas'></canvas><canvas id='chart2' class='graph-canvas'></canvas>`)
}
function edit_tracker(tracker) {
    return (`
    <form id="${tracker.trackerid}" class=" card" style="border: 3px solid ${tracker.color}">
                    <input class = "form_text"type="text" value="${tracker.name}">
                    <h1 class="form-title">Daily Goal</h1>
                    <input class="form-input" type="number" id="newgoal"value="${tracker.goal}" min="1" max="24" oninput="this.value=validateHrs(this.value,this.max)">
                    <h1 class="form-title">Color</h1>
                    <input class = "form-input form_color" oninput="toggle_color(this)"type="color" value='${tracker.color}'>
                    <div class="form_buttons">
                    <i class="far fa-window-close  form_button" onclick="reload_a_card(${tracker.trackerid})"></i>
                  <i class="far fa-check-square form_button"  onclick="save_tracker(${tracker.trackerid})"></i>
                     </div>

    </form>`)
}
function form_template() {
    return (`
    <form id="create_new_card" class="card" style=" border: 3px solid var(--foreground)">
                    <input class = "form_text"type="text" placeholder="Type name of new tracker">
                    <h1 class="form-title">Daily Goal</h1>
                    <input class ="form-input" type="number" id="newgoal"placeholder="hrs" min="1" max="24" oninput="this.value=validateHrs(this.value,this.max)">
                    <h1 class="form-title">Color</h1>
                    <input class = "form-input form_color" oninput="toggle_color(this)"type="color">
                    <div class="form_buttons">
                    <i class="far fa-window-close  form_button" onclick="cancel_new_card()"></i>
                  <i class="far fa-check-square form_button"  onclick="create_tracker()"></i>
                     </div>

            </form>`)
}
function trackerButtons_template() {
    return (`
    <div class="button-container">
        <div id="filter_buttons">
            <button onclick="filterButton(this)" id="d">Day</button>
            <button onclick="filterButton(this)" id="w" >Week</button>
            <button onclick="filterButton(this)" id="m">Month</button>
            <button onclick="filterButton(this)" id="y">Year</button>
        </div>
            <button onclick="add_card()"  class="possetive add_tracker">Add</button>
        
    </div>
    <div id = "cards" class="card-container" >

    </div>
    `)

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