const userPanel = document.getElementById("Users")
const userTable = document.getElementById("userTable")

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
    fetch("http://localhost:3000/user/" + username, {
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(info => {
        console.log(info);
    })
}

getUsers()