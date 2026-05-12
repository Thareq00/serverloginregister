const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* HUBUNGKAN FRONTEND */
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});
/* LOGIN */
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    console.log(username, password);

    res.json({
        message: "Login berhasil",
        token: "123456"
    });

});

/* REGISTER */
app.post("/register", (req, res) => {

    const { username, password } = req.body;

    console.log(username, password);

    res.json({
        message: "Register berhasil"
    });

});
app.listen(3000, () => {
    console.log("Server berjalan di port 3000");
});