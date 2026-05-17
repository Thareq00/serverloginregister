async function login(event) {

    event.preventDefault();

    let user =
        document.getElementById("loginUser").value;

    let pass =
        document.getElementById("loginPass").value;

    try {

        const response = await fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: user,
                password: pass
            })

        });

        const data = await response.json();

        alert(data.message);

        if (data.message === "Login berhasil") {

            localStorage.setItem(
                "loginUser",
                user
            );

            window.location.href = "index.html";

        }

    } catch (error) {

        console.log(error);

        alert("Server error!");

    }

}