function register(event) {

    event.preventDefault();

    let user =
        document.getElementById("regUser").value;

    let pass =
        document.getElementById("regPass").value;

    let mail =
        document.getElementById("regMail").value;

    if (!user || !pass || !mail) {

        alert("Data tidak lengkap!");

        return;
    }

    /* AMBIL DATA USER */
    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    /* BATAS 7 USER */
    if (users.length >= 7) {

        alert("Maksimal hanya 7 user!");

        return;
    }

    /* CEK USER SUDAH ADA */
    let cekUser = users.find(
        data => data.username === user
    );

    if (cekUser) {

        alert("Username sudah digunakan!");

        return;
    }

    /* TAMBAH USER */
    users.push({
        username: user,
        password: pass,
        email: mail
    });

    /* SIMPAN */
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Register berhasil!");

    window.location.href = "login.html";
}
async function login(event) {

    event.preventDefault();

    const username =
        document.getElementById("loginUser").value;

    const password =
        document.getElementById("loginPass").value;

    const response = await fetch("/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username,
            password
        })

    });

    const data = await response.json();

    alert(data.message);

    if (data.token) {

        localStorage.setItem(
            "token",
            data.token
        );

        window.location.href =
            "index.html";
    }
}
async function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username,
            password
        })

    });

    const data = await response.json();

    alert(data.message);
}