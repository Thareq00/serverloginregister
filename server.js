const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());

/* FRONTEND */
app.use(express.static(path.join(__dirname, "public")));

/* FILE DATABASE */
const USERS_FILE = "users.json";

/* AMBIL USER */
function getUsers() {

    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, "[]");
    }

    return JSON.parse(
        fs.readFileSync(USERS_FILE)
    );
}

/* SIMPAN USER */
function saveUsers(users) {

    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(users, null, 2)
    );

}

/* HOME */
app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});

/* REGISTER */
app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    const users = getUsers();

    /* CEK USER */
    const userExists = users.find(
        user => user.username === username
    );

    if (userExists) {

        return res.json({
            message: "Username sudah digunakan"
        });

    }

    /* HASH PASSWORD */
    const hashedPassword =
        await bcrypt.hash(password, 10);

    /* SIMPAN USER */
    users.push({
        username,
        password: hashedPassword
    });

    saveUsers(users);

    res.json({
        message: "Register berhasil"
    });

});

/* LOGIN */
app.post("/login", async (req, res) => {

    const { username, password } = req.body;

    const users = getUsers();

    const user = users.find(
        user => user.username === username
    );

    if (!user) {

        return res.json({
            message: "User tidak ditemukan"
        });

    }

    const validPassword =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!validPassword) {

        return res.json({
            message: "Password salah"
        });

    }

    res.json({
        message: "Login berhasil"
    });

});

app.listen(3000, () => {
    console.log("Server berjalan di port 3000");
});