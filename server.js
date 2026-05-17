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

    const {
        username,
        password,
        email
    } = req.body;

    const users = getUsers();

    /* BATAS 7 USER */
    if (users.length >= 7) {

        return res.json({
            message: "Maksimal hanya 7 user!"
        });

    }

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
        email,
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



/* AMBIL TRANSAKSI */
function getTransaksi(transaksi) {

    if (!fs.existsSync(TRANSAKSI_FILE)) {
        fs.writeFileSync(TRANSAKSI_FILE, "[]");
    }

    return JSON.parse(
        fs.readFileSync(TRANSAKSI_FILE)
    );
}

/* SIMPAN TRANSAKSI */
function saveTransaksi(transaksi) {

    fs.writeFileSync(
        TRANSAKSI_FILE,
        JSON.stringify(transaksi, null, 2)
    );

}

/* GET TRANSAKSI USER */
app.get("/transaksi/:username", (req, res) => {

    const username = req.params.username;

    const semuaTransaksi =
        getTransaksi();

    const transaksiUser =
        semuaTransaksi.filter(
            item => item.username === username
        );

    res.json(transaksiUser);

});

/* TAMBAH TRANSAKSI */
app.post("/transaksi", (req, res) => {

    const transaksiBaru = req.body;

    const semuaTransaksi =
        getTransaksi();

    semuaTransaksi.push(transaksiBaru);

    saveTransaksi(semuaTransaksi);

    res.json({
        message: "Transaksi berhasil disimpan"
    });

});

/* HAPUS TRANSAKSI */
app.delete("/transaksi/:id", (req, res) => {

    const id = Number(req.params.id);

    let semuaTransaksi =
        getTransaksi();

    semuaTransaksi =
        semuaTransaksi.filter(
            item => item.id !== id
        );

    saveTransaksi(semuaTransaksi);

    res.json({
        message: "Transaksi berhasil dihapus"
    });

});
app.listen(3000, () => {
    console.log("Server berjalan di port 3000");
});

/* EDIT TRANSAKSI */
app.put("/transaksi/:id", (req, res) => {

    const id = Number(req.params.id);

    const {
        keterangan,
        jumlah,
        tipe,
        tanggal
    } = req.body;

    let semuaTransaksi =
        getTransaksi();

    const index =
        semuaTransaksi.findIndex(
            item => item.id === id
        );

    if (index === -1) {

        return res.json({
            message:
                "Transaksi tidak ditemukan"
        });

    }

    semuaTransaksi[index] = {

        ...semuaTransaksi[index],

        keterangan,

        jumlah,

        tipe,

        tanggal

    };

    saveTransaksi(semuaTransaksi);

    res.json({
        message:
            "Transaksi berhasil diupdate"
    });

});
const TRANSAKSI_FILE = "transaksi.json";