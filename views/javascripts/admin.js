const userPanel = document.getElementById("Users")
const userTable = document.getElementById("userTable")
const statTable = document.getElementById("statTable")
const statDiv = document.getElementById("Stats")
var sorted = "Descending"
var sortedBy = "username"

async function fetchTasks(username){
    return fetch("http://localhost:3000/task/user/" + username, {
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(info => {
        return info
    })
}

async function fetchUsers(){
    return fetch("http://localhost:3000/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(info => {
        return info
    })
}

function buildUserTable(info){
    userTable.innerHTML = `<thead>
        <tr class="userInfo">
            <th class="userHeader" onclick="javascript:sortTable('username', 'Users')"> Username </th>
            <th class="userHeader" onclick="javascript:sortTable('first_name', 'Users')"> First Name </th>
            <th class="userHeader" onclick="javascript:sortTable('last_name', 'Users')"> Last Name </th>
            <th></th>
            <th></th>
        </tr>
        </thead>`
    for(user of info){
        userTable.insertAdjacentHTML("beforeend", `
        <tr id='` + user.username + `'>
            <td onclick="javascript:getSpecific('`+ user.username +`')" class="userInfo">` + user.username + ` </td>
            <td onclick="javascript:getSpecific('`+ user.username +`')" class="userInfo">` + user.first_name + `</td>
            <td onclick="javascript:getSpecific('`+ user.username +`')" class="userInfo">` + user.last_name + ` </td>
            <td onclick="javascript:editUser('` + user.username + `')" class="userEdit"> Edit </td>
            <td onclick="javascript:deleteUser('` + user.username + `')"class="userEdit"> Delete </td>
        </tr>    
        `)
    }
}

function buildTaskTable(info, username){
    var current = 0
    var totalGoal = 0

    statTable.innerHTML = `
    <tr>
        <th class="taskHeader" onclick="javascript:sortTable('name', 'Tasks', '` + username + `')"> Name </th>
        <th class="taskHeader" onclick="javascript:sortTable('currenttime', 'Tasks', '` + username + `')"> Current Time </th>
        <th class="taskHeader" onclick="javascript:sortTable('goal', 'Tasks', '` + username + `')"> Goal </th>
    </tr>
    `

    for(task of info){
        current += task.currenttime
        totalGoal += task.goal
        statTable.insertAdjacentHTML("beforeend", `
        <tr>
            <td class="taskColumn">` + task.name + `</td>
            <td class="taskColumn">` + task.currenttime + `h</td>
            <td class="taskColumn">` + task.goal + `h</td>
        </tr>    
        `)
    }

    statTable.insertAdjacentHTML("beforeend", `
    <tr>
        <td class="taskColumn" style="font-weight: bold"> Total </td>
        <td class="taskColumn" style="font-weight: bold"> `+ current +`h </td>
        <td class="taskColumn" style="font-weight: bold"> ` + totalGoal + `h </td>
    </tr>
        `)

    statDiv.style.display = "block"
}

function getUsers(){
    sortTable("username", "Users")
}

function getSpecific(username){
    sortTable("name", "Tasks", username)
}

function editUser(username){
    const selectedUserRow = document.getElementById(username);
    selectedUserRow.innerHTML = `
    <td> ${selectedUserRow.children[0].innerHTML} </td>
    <td> <input type="text" id="update_firstname" value="${selectedUserRow.children[1].innerHTML}" </td>
    <td> <input type="text" id="update_lastname" value="${selectedUserRow.children[2].innerHTML}" </td>
    <td onclick="javascript:saveUser('` + username + `')" class="userEdit"> Save </td>
    <td onclick="javascript:deleteUser('` + username + `')" class="userEdit"> Delete </td>
    `
}

async function saveUser(username){
    const savedFirstName = document.getElementById("update_firstname")
    const savedLastName = document.getElementById("update_lastname")
    
    const savedUser = {
        first_name: savedFirstName.value,
        last_name: savedLastName.value
    }

    await fetch('http://localhost:3000/user/' + username, {
        method: "PUT",
        headers:{
           "Content-Type": "application/json"
        },
        body: JSON.stringify(savedUser)
    })

    sortTable("username", "Users")
}

async function deleteUser(username){
    await fetch('http://localhost:3000/time/user/' + username, {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json"
        }
    })

    await fetch('http://localhost:3000/task/user/' + username, {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json"
        }
    })

    await fetch('http://localhost:3000/user/' + username, {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json"
        }
    }).then(response => {
        console.log(response);
    })
}

// The username in this function is optional and only needed if the tasks table is to be sorted
async function sortTable(sortBy, Type, username){
    var info
    if(Type == "Users"){
        info = await fetchUsers()
    }else{
        info = await fetchTasks(username)
    }
    
    if(sorted == "Ascending" && sortBy == sortedBy){
        sorted = "Descending"
        info.sort((a, b) => {
            if(isNaN(a[sortBy])){
                return b[sortBy].localeCompare(a[sortBy])
            }else{
                return b[sortBy]-a[sortBy]
            }
        })
    }else{
        sorted = "Ascending"
        info.sort((a, b) => {
            if(isNaN(a[sortBy])){
                return a[sortBy].localeCompare(b[sortBy])
            }else{
                return a[sortBy]-b[sortBy]
            }
        })
    }

    sortedBy = sortBy
    if(Type == "Users"){
        buildUserTable(info)
    }else{
        buildTaskTable(info, username)
    }
    
}

getUsers()