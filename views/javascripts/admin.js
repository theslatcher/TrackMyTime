const userPanel = document.getElementById("Users")
const userTable = document.getElementById("userTable")
const statTable = document.getElementById("statTable")
const statDiv = document.getElementById("Stats")
var sorted = "Descending"
var sortedBy = "username"

async function fetchTasks(userId){
    return fetch("http://localhost:3000/task/user/" + userId, {
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
            <th onclick="javascript:sortTable('username', 'Users')"> Username </th>
            <th onclick="javascript:sortTable('first_name', 'Users')"> First Name </th>
            <th onclick="javascript:sortTable('last_name', 'Users')"> Last Name </th>
        </tr>
        </thead>`
    for(user of info){
        userTable.insertAdjacentHTML("beforeend", `
        <tr id='` + user.userId + `'>
            <td onclick="javascript:getSpecific('`+ user.userId +`')" class="userInfo">` + user.username + ` </td>
            <td onclick="javascript:getSpecific('`+ user.userId +`')" class="userInfo">` + user.first_name + `</td>
            <td onclick="javascript:getSpecific('`+ user.userId +`')" class="userInfo">` + user.last_name + ` </td>
            <td onclick="javascript:editUser('` + user.userId + `')" class="userEdit"> Edit </td>
            <td onclick="javascript:deleteUser('` + user.userId + `')"class="userEdit"> Delete </td>
        </tr>    
        `)
    }
}

function buildTaskTable(info, userId){
    var current = 0
    var totalGoal = 0

    statTable.innerHTML = `
    <tr>
        <th onclick="javascript:sortTable('name', 'Tasks', '` + userId + `')"> Name </th>
        <th onclick="javascript:sortTable('currenttime', 'Tasks', '` + userId + `')"> Current Time </th>
        <th onclick="javascript:sortTable('goal', 'Tasks', '` + userId + `')"> Goal </th>
    </tr>
    `

    for(task of info){
        current += task.currenttime
        totalGoal += task.goal
        statTable.insertAdjacentHTML("beforeend", `
        <tr>
            <td>` + task.name + `</td>
            <td>` + task.currenttime + `h</td>
            <td>` + task.goal + `h</td>
        </tr>    
        `)
    }

    statTable.insertAdjacentHTML("beforeend", `
    <tr>
        <td style="font-weight: bold"> Total </td>
        <td style="font-weight: bold"> `+ current +`h </td>
        <td style="font-weight: bold"> ` + totalGoal + `h </td>
    </tr>
        `)

    statDiv.style.display = "block"
}

function getUsers(){
    sortTable("username", "Users")
}

function getSpecific(userId){
    sortTable("name", "Tasks", userId)
}

function editUser(userId){
    const selectedUserRow = document.getElementById(userId);
    selectedUserRow.innerHTML = `
    <td> ${selectedUserRow.children[0].innerHTML} </td>
    <td> <input type="text" id="update_firstname" value="${selectedUserRow.children[1].innerHTML}" </td>
    <td> <input type="text" id="update_lastname" value="${selectedUserRow.children[2].innerHTML}" </td>
    <td onclick="javascript:saveUser('` + userId + `')" class="userEdit"> Save </td>
    <td onclick="javascript:deleteUser('` + userId + `')" class="userEdit"> Delete </td>
    `
}

async function saveUser(userId){
    const savedFirstName = document.getElementById("update_firstname")
    const savedLastName = document.getElementById("update_lastname")
    
    const savedUser = {
        first_name: savedFirstName.value,
        last_name: savedLastName.value
    }

    await fetch('http://localhost:3000/user/' + userId, {
        method: "PUT",
        headers:{
           "Content-Type": "application/json"
        },
        body: JSON.stringify(savedUser)
    })

    sortTable("username", "Users")
}

async function deleteUser(userId){
    console.log(userId);
    await fetch('http://localhost:3000/user/' + userId, {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json"
        }
    }).then(response => {
        console.log(response);
    })
}

// The userId in this function is optional and only needed if the tasks table is to be sorted
async function sortTable(sortBy, Type, userId){
    var info
    if(Type == "Users"){
        info = await fetchUsers()
    }else{
        info = await fetchTasks(userId)
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
        buildTaskTable(info, userId)
    }
    
}

getUsers()