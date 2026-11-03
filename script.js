let html5QrCode = null;
let currentField = "";
let isScanning = false;

/* =========================
   START SCAN
========================= */

async function startScan(fieldId) {

    if (isScanning) {
        return;
    }

    currentField = fieldId;

    const modal =
        document.getElementById("scannerModal");

    modal.style.display = "block";

    try {

        html5QrCode =
            new Html5Qrcode("reader");

        isScanning = true;

        await html5QrCode.start(
            {
                facingMode: "environment"
            },
            {
                fps: 10,
                qrbox: 250
            },
            onScanSuccess,
            onScanFailure
        );

    } catch (error) {

        console.error(error);

        modal.style.display = "none";

        alert("Gagal membuka kamera");

        isScanning = false;

    }

}

/* =========================
   SCAN SUCCESS
========================= */

async function onScanSuccess(decodedText) {

    if (!isScanning) {
        return;
    }

    isScanning = false;

    // Isi field sesuai tombol scan
    document.getElementById(currentField).value =
        decodedText;

    // Tutup modal lebih dulu
    document.getElementById("scannerModal")
        .style.display = "none";

    try {

        if (html5QrCode) {

            await html5QrCode.stop();
            await html5QrCode.clear();

            html5QrCode = null;

        }

    } catch (error) {

        console.error(error);

    }

    // Bersihkan area reader
    document.getElementById("reader").innerHTML = "";

}

/* =========================
   SCAN FAILURE
========================= */

function onScanFailure(error) {

    // biarkan kosong

}

/* =========================
   CLOSE SCANNER
========================= */

document
.getElementById("closeScanner")
.addEventListener("click", async () => {

    document.getElementById("scannerModal")
        .style.display = "none";

    try {

        if (html5QrCode) {

            await html5QrCode.stop();
            await html5QrCode.clear();

            html5QrCode = null;

        }

    } catch (error) {

        console.error(error);

    }

    isScanning = false;

    document.getElementById("reader").innerHTML = "";

});

/* =========================
   BUTTON SCAN
========================= */

document
.getElementById("scanOperator")
.addEventListener("click", () => {

    startScan("operator");

});

document
.getElementById("scanDeviceHandphone")
.addEventListener("click", () => {

    startScan("deviceHandphone");

});

document
.getElementById("scanDeviceScanner")
.addEventListener("click", () => {

    startScan("deviceScanner");

});

/* =========================
   SUBMIT DATA
========================= */

function submitData() {

    const operator =
        document.getElementById("operator").value;

    const deviceHandphone =
        document.getElementById("deviceHandphone").value;

    const deviceScanner =
        document.getElementById("deviceScanner").value;

    const status =
        document.getElementById("status").value;

    if (
        !operator ||
        !deviceHandphone ||
        !deviceScanner
    ) {

        alert("Lengkapi semua scan terlebih dahulu");

        return;

    }

    const form =
        document.createElement("form");

    form.method = "POST";

    form.action =
        "https://script.google.com/macros/s/AKfycbz_bf60XkLRA5IhVyxFh5R5OaOFlk7sXgQlnhFsRkRKQpd2lDIwwUYRJLBb-k9RLjBXiQ/exec";

    form.target = "hiddenFrame";

    const fields = {
        operator,
        deviceHandphone,
        deviceScanner,
        status
    };

    Object.keys(fields).forEach(key => {

        const input =
            document.createElement("input");

        input.type = "hidden";
        input.name = key;
        input.value = fields[key];

        form.appendChild(input);

    });

    document.body.appendChild(form);

    form.submit();

    document.body.removeChild(form);

    alert("Data berhasil disimpan");

    resetForm();

}

/* =========================
   RESET FORM
========================= */

function resetForm() {

    document.getElementById("operator").value = "";
    document.getElementById("deviceHandphone").value = "";
    document.getElementById("deviceScanner").value = "";

    currentField = "";

    if (html5QrCode) {

        try {
            html5QrCode.stop();
        } catch (e) {}

        try {
            html5QrCode.clear();
        } catch (e) {}

        html5QrCode = null;
    }

    document.getElementById("reader").innerHTML = "";
}

/* =========================
   SUBMIT BUTTON
========================= */

document
.getElementById("submit")
.addEventListener("click", submitData);
