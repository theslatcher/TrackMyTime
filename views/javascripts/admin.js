const userPanel = document.getElementById("Users")
const userTable = document.getElementById("userTable")
const statTable = document.getElementById("statTable")
const statDiv = document.getElementById("Stats")
var sorted = "Descending"

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
            <th onclick="javascript:sortTable('username')"> Username </th>
            <th onclick="javascript:sortTable('first_name')"> First Name </th>
            <th onclick="javascript:sortTable('last_name')"> Last Name </th>
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

async function getSpecific(username){
    const info = await fetchTasks(username)
    var current = 0
    var totalGoal = 0

    statTable.innerHTML = `
    <tr>
        <th> Name </th>
        <th> Current Time </th>
        <th> Goal </th>
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

async function sortTable(sortBy){
    var info = await fetchUsers()
    if(sorted == "Ascending"){
        sorted = "Descending"
        info.sort((a, b) => {
            if(!a[sortBy] || !b[sortBy]){
                return b
            }else{
                return b[sortBy].localeCompare(a[sortBy])
            }
        })
    }else{
        sorted = "Ascending"
        info.sort((a, b) => {
            if(!a[sortBy] || !b[sortBy]){
                return a
            }else{
                return a[sortBy].localeCompare(b[sortBy])
            }
        })
    }
    buildUserTable(info)
}

sortTable("username")