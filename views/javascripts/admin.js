const userPanel = document.getElementById("Users")
const userTable = document.getElementById("userTable")
const statTable = document.getElementById("statTable")
const statDiv = document.getElementById("Stats")
var sorted = "Descending"
var userSortedBy = "username"
var taskSortedBy

async function fetchTasks(userId) {
    return fetch("/task/user/" + userId, {
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

async function fetchUsers() {
    return fetch("/user", {
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

function buildUserTable(info) {
    userTable.innerHTML = `<thead>
        <tr class="userInfo">
            <th class="userHeader" onclick="javascript:sortTable('username', 'Users')"> Username </th>
            <th class="userHeader" onclick="javascript:sortTable('first_name', 'Users')"> First Name </th>
            <th class="userHeader" onclick="javascript:sortTable('last_name', 'Users')"> Last Name </th>
            <th></th>
            <th></th>
        </tr>
        </thead>`
    for (user of info) {
        userTable.insertAdjacentHTML("beforeend", `
        <tr id='` + user.userId + `'>
            <td onclick="javascript:getSpecific('`+ user.userId + `')" class="userInfo">` + user.username + ` </td>
            <td onclick="javascript:getSpecific('`+ user.userId + `')" class="userInfo">` + user.first_name + `</td>
            <td onclick="javascript:getSpecific('`+ user.userId + `')" class="userInfo">` + user.last_name + ` </td>
            <td onclick="javascript:editUser('` + user.userId + `')" class="userEdit"> Edit </td>
            <td onclick="javascript:deleteUser('` + user.userId + `')"class="userEdit"> Delete </td>
        </tr>    
        `)
    }
}

function buildTaskTable(info, userId) {
    var current = 0
    var totalGoal = 0

    statTable.innerHTML = `
    <tr>
        <th class="taskHeader" onclick="javascript:sortTable('name', 'Tasks', '` + userId + `')"> Name </th>
        <th class="taskHeader" onclick="javascript:sortTable('currenttime', 'Tasks', '` + userId + `')"> Time </th>
        <th class="taskHeader" onclick="javascript:sortTable('goal', 'Tasks', '` + userId + `')"> Goal </th>
    </tr>
    `

    for (task of info) {
        current += task.currenttime
        totalGoal += task.goal
        time = calc_time_from_db(task.currenttime)


        statTable.insertAdjacentHTML("beforeend", `
        <tr>
            <td class="taskColumn">` + task.name + `</td>
            <td class="taskColumn">` + (time.hours + "h " + time.min + "m") + `</td>
            <td class="taskColumn">` + task.goal + `h</td>
        </tr>    
        `)
    }
    time = calc_time_from_db(current)

    statTable.insertAdjacentHTML("beforeend", `
    <tr>
        <td class="taskColumn" style="font-weight: bold"> Total </td>
        <td class="taskColumn" style="font-weight: bold"> `+ (time.hours + "h " + time.min + "m") + ` </td>
        <td class="taskColumn" style="font-weight: bold"> ` + totalGoal + `h </td>
    </tr>
        `)

    statDiv.style.display = "block"
}

function getUsers() {
    sortTable("username", "Users")
}

function getSpecific(userId) {
    sortTable("name", "Tasks", userId)
}

function editUser(userId) {
    const selectedUserRow = document.getElementById(userId);
    selectedUserRow.innerHTML = `
    <td class="userInfo"> ${selectedUserRow.children[0].innerHTML} </td>
    <td> <input type="text" onkeypress="this.style.width = (this.value.length ) + 'ch';" class="userInput" id="update_firstname" value="${selectedUserRow.children[1].innerHTML}" </td>
    <td> <input type="text" onkeypress="this.style.width = (this.value.length) + 'ch';" class="userInput"id="update_lastname" value="${selectedUserRow.children[2].innerHTML}" </td>
    <td onclick="javascript:saveUser('` + userId + `')" class="userEdit"> Save </td>
    <td onclick="javascript:deleteUser('` + userId + `')" class="userEdit"> Delete </td>
    `
}

async function saveUser(userId) {
    const savedFirstName = document.getElementById("update_firstname")
    const savedLastName = document.getElementById("update_lastname")

    const savedUser = {
        first_name: savedFirstName.value,
        last_name: savedLastName.value
    }

    await fetch('/user/' + userId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(savedUser)
    }).then(response => {
        console.log(response)
    })

    updateTable()
}

async function deleteUser(userId) {
    await fetch('/time/user/' + userId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })

    await fetch('/task/user/' + userId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })

    await fetch('/user/' + userId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        updateTable()
    })
}

// The userId in this function is optional and only needed if the tasks table is to be sorted
async function sortTable(sortBy, Type, userId) {
    var info
    var sortedBy
    if (Type == "Users") {
        sortedBy = userSortedBy
        info = await fetchUsers()
    } else {
        info = await fetchTasks(userId)
    }

    if (sorted == "Ascending" && sortBy == sortedBy) {
        sorted = "Descending"
        info.sort((a, b) => {
            if (isNaN(a[sortBy])) {
                return b[sortBy].localeCompare(a[sortBy])
            } else {
                return b[sortBy] - a[sortBy]
            }
        })
    } else {
        sorted = "Ascending"
        info.sort((a, b) => {
            if (isNaN(a[sortBy])) {
                return a[sortBy].localeCompare(b[sortBy])
            } else {
                return a[sortBy] - b[sortBy]
            }
        })
    }

    if (Type == "Users") {
        userSortedBy = sortBy
        buildUserTable(info)
    } else {
        buildTaskTable(info, userId)
    }

}

async function updateTable() {
    const info = await fetchUsers()

    if (sorted == "Ascending") {
        info.sort((a, b) => {
            return a[userSortedBy].localeCompare(b[userSortedBy])
        })
    } else {
        info.sort((b, a) => {
            return a[userSortedBy].localeCompare(b[userSortedBy])
        })
    }

    buildUserTable(info)
}


async function logout() {
    await fetch('/user/signout')
    location.href = '/'
}

document.addEventListener("DOMContentLoaded", () => {
    theme_check()
    getUsers()
})