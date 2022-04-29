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
        <tr>
            <th onclick="javascript:sortTable('username', 'Users')"> Username </th>
            <th onclick="javascript:sortTable('first_name', 'Users')"> First Name </th>
            <th onclick="javascript:sortTable('last_name', 'Users')"> Last Name </th>
        </tr>
        </thead>`
    for(user of info){
        userTable.insertAdjacentHTML("beforeend", `
        <tr onclick="javascript:getSpecific('`+ user.username +`')">
            <td>` + user.username + ` </td>
            <td>` + user.first_name + `</td>
            <td>` + user.last_name + ` </td>
        </tr>    
        `)
    }
}

function buildTaskTable(info, username){
    var current = 0
    var totalGoal = 0

    statTable.innerHTML = `
    <tr>
        <th onclick="javascript:sortTable('name', 'Tasks', '` + username + `')"> Name </th>
        <th onclick="javascript:sortTable('currenttime', 'Tasks', '` + username + `')"> Current Time </th>
        <th onclick="javascript:sortTable('goal', 'Tasks', '` + username + `')"> Goal </th>
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

async function getUsers(){
    const info = await fetchUsers()
    buildUserTable(info)
}

async function getSpecific(username){
    const info = await fetchTasks(username)
    buildTaskTable(info, username)
}

async function sortTable(sortBy, Type, optional){
    var info
    if(Type == "Users"){
        info = await fetchUsers()
    }else{
        info = await fetchTasks(optional)
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
        buildTaskTable(info, optional)
    }
    
}

getUsers()