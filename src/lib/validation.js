const isValidName = (name) => {
    const re = /^[0-9]+$/
    return !re.test(String(name).toLowerCase())
}

const isValidEmail = (email) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

const isValidUserName = username => {
    console.log(username);
    const re = /^(?=.{4,20}$)(?:[a-zA-Z\d]+(?:(?:\.|-|_)[a-zA-Z\d])*)+$/;
    return re.test(username);
}

const isValidPassword = password => {
    const re = /^[0-9a-zA-Z]{6,}$/;
    return re.test(password);
}

module.exports = {
	isValidName, isValidEmail, isValidUserName, isValidPassword
};