function loginSubmission() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var result = document.getElementById("result");
    var accounts = [
        { user: "Admin", pwd: "ADM{super_secure_password}" },
        { user: "Tik", pwd: "ADM{Dislike_h4t3rs_ok}" },
        { user: "CTY", pwd: "ADM{my_wheel_so_big}" },
        { user: "rico", pwd: "ADM{wHy_4m_I_a_r0b0t?}" },
        { user: "Shelly", pwd: "ADM{sh3lly_Putb_legi}" },
        { user: "8-bit", pwd: "ADM{Et0_SD_bratik}" },
        { user: "Barley", pwd: "ADM{t0ugh_thr0w3r}" },
        { user: "darryl", pwd: "ADM{i_roll_i_barrel}" },
        { user: "nani", pwd: "ADM{I_h4v3_0ne_eye}" },
        { user: "Volt", pwd: "ADM{1s_th3_chromo_character}" },
    ];

    for (var a in accounts) {
        if (accounts[a].user == username && accounts[a].pwd == password) {
            if (username == "Shelly") {
                result.innerHTML = "Welcome, Shelly. The flag is " + password;
            } else {
                result.innerHTML = "Welcome, " + username + ".";
            }
            return false;
        }
    }

    result.innerHTML = "Login Failed. Please try again";

    return false;
}