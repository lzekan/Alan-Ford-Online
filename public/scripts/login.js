const swapForms = () => {
    const loginForm = document.getElementById("login-form");
    const regForm = document.getElementById("reg-form");

    if(loginForm.className === "login-form-hidden") {
        loginForm.className = "login-form-visible";
        regForm.className = "reg-form-hidden";
    } 
    else {
        regForm.className = "reg-form-visible";
        loginForm.className = "login-form-hidden";
    }

    document.querySelectorAll(".login-input-data, .reg-input-data").forEach((input) => {
        input.value = "";
    })

    document.getElementById("login-err") !== null ? document.getElementById("login-err").style.display = "none" : {};
    document.getElementById("reg-err") !== null ? document.getElementById("reg-err").style.display = "none" : {};
}

module.exports = swapForms;