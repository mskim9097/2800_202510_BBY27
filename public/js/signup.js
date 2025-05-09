var password = document.getElementById("password");
var confirmPassword = document.getElementById("confirmPassword");
var confirmPwMsg = document.getElementById("confirmPwMsg");

confirmPassword.addEventListener("input", () => {
    if(password.value == confirmPassword.value) {
        confirmPwMsg.innerHTML = "match";
        confirmPwMsg.style.color = "green";
    } else {
        confirmPwMsg.innerHTML = "not match";
        confirmPwMsg.style.color = "red";
    }    
})