let currentUser =
    localStorage.getItem("loginUser");
let chart;
/* CEK LOGIN */
if (!currentUser) {

    window.location.href =
        "login.html";

}

/* ELEMENT */
let welcome =
    document.getElementById("welcome");

let totalSaldo =
    document.getElementById("total-saldo");

let pemasukan =
    document.getElementById("pemasukan");

let pengeluaran =
    document.getElementById("pengeluaran");

/* NAMA USER */
welcome.innerHTML =
    `Hallo ${currentUser.toUpperCase()}`;


/* LOAD DASHBOARD */
async function loadDashboard() {

    try {

        const response =
            await fetch(
                `/transaksi/${currentUser}`
            );

        const transaksi =
            await response.json();

        let totalMasuk = 0;

        let totalKeluar = 0;

        transaksi.forEach(item => {

            if (item.tipe === "masuk") {

                totalMasuk +=
                    Number(item.jumlah);

            } else {

                totalKeluar +=
                    Number(item.jumlah);

            }

        });

        let saldo =
            totalMasuk - totalKeluar;

        /* TAMPILKAN */
        totalSaldo.innerHTML =
            "Rp " +
            saldo.toLocaleString("id-ID");

        pemasukan.innerHTML =
            "Rp " +
            totalMasuk.toLocaleString("id-ID");

        pengeluaran.innerHTML =
            "Rp " +
            totalKeluar.toLocaleString("id-ID");

        renderChart(totalMasuk, totalKeluar);   

    } catch (error) {

        console.log(error);

    }

}


/* LOGOUT */
function logout() {

    localStorage.removeItem(
        "loginUser"
    );

    window.location.href =
        "login.html";

}

function renderChart(totalMasuk, totalKeluar){

    const ctx =
        document
        .getElementById("financeChart");

    if(chart){

        chart.destroy();

    }

    chart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "Pemasukan",
                "Pengeluaran"
            ],

            datasets: [{

                data: [
                    totalMasuk,
                    totalKeluar
                ],

                backgroundColor: [

                    "#22c55e",
                    "#ef4444"

                ],

                borderWidth:0

            }]

        },

        options: {

            responsive:true,

            plugins: {

                legend: {

                    labels: {

                        color:"white"

                    }

                }

            }

        }

    });

}

/* LOAD */
loadDashboard();