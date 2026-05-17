let form = document.getElementById("cashForm");

let table =
    document.getElementById("data-transaksi");

let saldoText =
    document.getElementById("saldo");

let namaUser =
    document.getElementById("nama-user");

let totalMasukText =
    document.getElementById("total-masuk");

let totalKeluarText =
    document.getElementById("total-keluar");

let sortSelect =
    document.getElementById("sortSelect");

let currentUser =
    localStorage.getItem("loginUser");

/* CEK LOGIN */
if (!currentUser) {

    alert("Silakan login terlebih dahulu!");

    window.location.href = "login.html";

}

/* TAMPIL USER */
namaUser.innerHTML =
    `Hallo ${currentUser.toUpperCase()}`;

/* ARRAY TRANSAKSI */
let transaksi = [];


/* LOAD TRANSAKSI */
async function loadTransaksi() {

    const response =
        await fetch(
            `/transaksi/${currentUser}`
        );

    transaksi =
        await response.json();

    tampilData();

}


/* TAMPILKAN DATA */
function tampilData() {

    let totalMasuk = 0;

    let totalKeluar = 0;

    let saldo = 0;
    /* SORT DATA */
let dataSort = [...transaksi];

if (sortSelect.value === "terbaru") {

    dataSort.sort((a, b) => {

    const [da, ma, ya] = a.tanggal.split("/");
    const [db, mb, yb] = b.tanggal.split("/");

    return new Date(`${yb}-${mb}-${db}`) -
           new Date(`${ya}-${ma}-${da}`);

});

}

else if (sortSelect.value === "terlama") {

    dataSort.sort((a, b) => {

    const [da, ma, ya] = a.tanggal.split("/");
    const [db, mb, yb] = b.tanggal.split("/");

    return new Date(`${ya}-${ma}-${da}`) -
           new Date(`${yb}-${mb}-${db}`);

});

}

else if (sortSelect.value === "terbesar") {

    dataSort.sort(
        (a, b) =>
        Number(b.jumlah) -
        Number(a.jumlah)
    );

}

else if (sortSelect.value === "terkecil") {

    dataSort.sort(
        (a, b) =>
        Number(a.jumlah) -
        Number(b.jumlah)
    );

}

else if (sortSelect.value === "a-z") {

    dataSort.sort(
        (a, b) =>
        a.keterangan.localeCompare(
            b.keterangan
        )
    );

}

    table.innerHTML = "";

    dataSort.forEach((item, index) => {

        if (item.tipe === "masuk") {

            saldo += Number(item.jumlah);

            totalMasuk +=
                Number(item.jumlah);

        } else {

            saldo -= Number(item.jumlah);

            totalKeluar +=
                Number(item.jumlah);

        }

        table.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${item.keterangan}</td>

            <td>${item.tipe}</td>

            <td>
                Rp ${Number(item.jumlah)
                    .toLocaleString("id-ID")}
            </td>

            <td>${item.tanggal}</td>

            <td>

                <button
                    onclick="hapusTransaksi(${item.id})">

                    Hapus

                </button>

                <button
                    onclick="editTransaksi(${item.id})">

                    Edit

                </button>

            </td>

        </tr>
        `;

    });

    saldoText.innerHTML =
        "Rp " +
        saldo.toLocaleString("id-ID");

    totalMasukText.innerHTML =
        "Rp " +
        totalMasuk.toLocaleString("id-ID");

    totalKeluarText.innerHTML =
        "Rp " +
        totalKeluar.toLocaleString("id-ID");

}


/* TAMBAH TRANSAKSI */
form.addEventListener(
    "submit",
    async function(event){

    event.preventDefault();

    let keterangan =
        document.getElementById("keterangan").value;

    let jumlah =
        document.getElementById("jumlah").value;

    let tipe =
        document.getElementById("tipe").value;

    let tanggal =
        new Date()
        .toLocaleDateString("id-ID");

    let transaksiBaru = {

        id: Date.now(),

        username: currentUser,

        keterangan,

        jumlah,

        tipe,

        tanggal:
            new Date()
            .toLocaleDateString("id-ID")

    };

   await fetch("/transaksi", {

    method: "POST",

    headers: {
        "Content-Type":
            "application/json"
    },

    body: JSON.stringify(
        transaksiBaru)

});

    form.reset();

    loadTransaksi();

});

/* EDIT TRANSAKSI */
async function editTransaksi(id) {

    const data =
        transaksi.find(
            item => item.id === id
        );

    let keterangan =
        prompt(
            "Edit keterangan:",
            data.keterangan
        );

    let jumlah =
        prompt(
            "Edit jumlah:",
            data.jumlah
        );

    let tipe =
        prompt(
            "Edit tipe (masuk/keluar):",
            data.tipe
        );
    let tanggal =
        prompt(
            "Edit tanggal:",
            data.tanggal ||""
        );

    if (
        !keterangan ||
        !jumlah ||
        !tipe ||
        !tanggal
    )
     {

        alert(
            "Data tidak boleh kosong!"
        );

        return;

    }

    await fetch(`/transaksi/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type":
                "application/json"
        },

        body: JSON.stringify({

            keterangan,
            jumlah,
            tipe,
            tanggal

        })

    });

    alert(
        "Transaksi berhasil diupdate!"
    );

    loadTransaksi();

}
/* HAPUS TRANSAKSI */
async function hapusTransaksi(id) {

    let yakin =
        confirm(
            "Yakin ingin menghapus transaksi ini?"
        );

    if (!yakin) return;

    await fetch(`/transaksi/${id}`, {

        method: "DELETE"

    });

    alert("Transaksi berhasil dihapus!");

    loadTransaksi();

}


/* BOTTOM NAV */
let home =
    document.getElementById("home");

home.addEventListener(
    "click",
    function () {

    window.location.href =
        "index.html";

});

sortSelect.addEventListener(
    "change",
    tampilData
);
/* LOAD AWAL */
loadTransaksi();