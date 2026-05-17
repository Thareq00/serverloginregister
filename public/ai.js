function aiPrediksi() {

    if (transaksi.length === 0) {

        document.getElementById(
            "ai-prediksi"
        ).innerHTML = `

            <p>
                Belum ada transaksi
            </p>

        `;

        return;

    }

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

    let rataPengeluaran =
        totalKeluar / 30;

    let prediksiHari = 0;

    if (rataPengeluaran > 0) {

        prediksiHari =
            Math.floor(
                saldo /
                rataPengeluaran
            );

    }

    let status = "";

    if (prediksiHari <= 7) {

        status =
        "⚠️ Keuangan mulai berbahaya";

    }

    else if (prediksiHari <= 30) {

        status =
        "💡 Pengeluaran cukup tinggi";

    }

    else {

        status =
        "✅ Kondisi keuangan aman";

    }

    document.getElementById(
        "ai-prediksi"
    ).innerHTML = `

        <p>
            💰 Saldo sekarang:
            <b>
                Rp ${saldo.toLocaleString("id-ID")}
            </b>
        </p>

        <br>

        <p>
            📉 Rata-rata pengeluaran:
            <b>
                Rp ${Math.floor(rataPengeluaran)
                    .toLocaleString("id-ID")}
            </b>
            / hari
        </p>

        <br>

        <p>
            🤖 Prediksi AI:
            saldo diperkirakan habis
            dalam
            <b>${prediksiHari} hari</b>
        </p>

        <br>

        <p>
            ${status}
        </p>

    `;

}