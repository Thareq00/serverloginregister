async function register(event) {

    event.preventDefault();

    let user =
        document.getElementById("registerUser").value;

    let pass =
        document.getElementById("registerPass").value;

    let mail =
        document.getElementById("registerMail").value;

    if (!user || !pass || !mail) {

        alert("Data tidak lengkap!");

        return;
    }

    try {

        const response = await fetch("/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: user,
                password: pass,
                email: mail
            })

        });

        const data = await response.json();

        alert(data.message);

        if (data.message === "Register berhasil") {

            window.location.href = "login.html";

        }

    } catch (error) {

        console.log(error);

        alert("Server error!");

    }

}