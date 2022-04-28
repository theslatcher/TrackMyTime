const userPanel = document.getElementById("Users")
const userTable = document.getElementById("userTable")
const statTable = document.getElementById("statTable")
const statDiv = document.getElementById("Stats")

function getUsers(){
    fetch("http://localhost:3000/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(info => {
        userTable.innerHTML = `<thead>
        <tr>
            <th> Username </th>
            <th> First Name </th>
            <th> Last Name </th>
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
    })
}

function getSpecific(username){
    statTable.innerHTML = `
    <tr>
        <th> Name </th>
        <th> Current Time </th>
        <th> Goal </th>
    </tr>
    `
    fetch("http://localhost:3000/task/user/" + username, {
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(info => {
        var current = 0
        var totalGoal = 0
        for(task of info){
            current += task.currenttime
            totalGoal += task.goal
            statTable.insertAdjacentHTML("beforeend", `
            <tr>
                <td>` + task.name + `h</td>
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
    })
}

getUsers()