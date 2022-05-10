
function card_template(tracker) {
    const time = calc_time_from_db(tracker.currenttime)
    const goal = calc_goal(tracker.goal)
    return (`
        
             <div class="card" style="${"border: 3px solid " + tracker.color}" id="${tracker.trackerid}">
                <h2 class = ""> ${tracker.name}</h2>
                <div class ="card-buttons">
                <i class="fas fa-trash card-button" onclick="delete_tracker(${tracker.trackerid}, '${tracker.name}')"></i>
               <i class="fas fa-plus card-button" onclick="card_form_toggle(this)"></i>  
                </div>
                <h1 class="">${time.hours + "h"}</h1>
                
                <input style="${"border-bottom: 1px solid " + tracker.color}" class="form-input card-hidden" type="number" min="1" max="99" placeholder="hrs">
                <h1 class="">${time.min + "m"}</h1>

                <input style="${"border-bottom: 1px solid " + tracker.color}" class="form-input card-hidden" type="number" min="1" max="59" placeholder="min" >

                <h2 class = "card-goal">${"Goal is " + goal}</h2>
                <i class="fas fa-equals card-button card-hidden" onclick="add_new_time(this)"></i>
                
            </div>
    `)

}


function form_template() {
    return (`
    <form id="create_new_card" class="card" style=" border: 3px solid var(--foreground)">
                    <input class = "form_text"type="text" placeholder="Type name of new tracker">
                    <h1 class="form-title">Goal</h1>
                    <input class ="form-input" type="number" id="newgoal"placeholder="hrs/day" min="1">
                    <h1 class="form-title">Color</h1>
                    <input class = "form-input form_color" onchange="test(this)"type="color">
                    <i class="far fa-window-close  form_button" onclick="load_trackers()"></i>
                  <i class="far fa-check-square form_button"  onclick="create_tracker()"></i>
                    

            </form>`)
}
function trackerButtons_template() {
    return (`
    <div class="button-container">
        <div id="filter_buttons">
            <button onclick="filterButton(id)" id="d">Day</button>
            <button onclick="filterButton(id)" id="w" >Week</button>
            <button onclick="filterButton(id)" id="m">Month</button>
            <button onclick="filterButton(id)" id="y">Year</button>
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