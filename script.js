let html5QrCode = null;
let currentField = "";

async function startScan(fieldId) {

    currentField = fieldId;

    document.getElementById("reader").innerHTML = "";

    html5QrCode = new Html5Qrcode("reader");

    try {

        await html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: 250
            },
            async (decodedText) => {

                // Isi field sesuai tombol yang ditekan
                document.getElementById(fieldId).value =
                    decodedText;

                // Update tampilan
                if(fieldId === "operator"){
                    document.getElementById("operatorView").textContent =
                        decodedText;
                }

                if(fieldId === "deviceHandphone"){
                    document.getElementById("hpView").textContent =
                        decodedText;
                }

                if(fieldId === "deviceScanner"){
                    document.getElementById("scannerView").textContent =
                        decodedText;
                }

                // Kamera mati setelah berhasil scan
                await html5QrCode.stop();
                await html5QrCode.clear();

                html5QrCode = null;

                document.getElementById("reader").innerHTML = "";

            },
            (error) => {
                // abaikan
            }
        );

    } catch(err) {

        console.error(err);
        alert("Gagal membuka kamera");

    }
}
async function onScanSuccess(decodedText) {

    document.getElementById(currentField).value =
        decodedText;

    // Update tampilan ringkasan
    if (currentField === "operator") {

        document.getElementById("operatorView")
        .textContent = decodedText;

    }

    if (currentField === "deviceHandphone") {

        document.getElementById("hpView")
        .textContent = decodedText;

    }

    if (currentField === "deviceScanner") {

        document.getElementById("scannerView")
        .textContent = decodedText;

    }

    try {

        await html5QrCode.stop();
        await html5QrCode.clear();

        html5QrCode = null;

    } catch (error) {

        console.error(error);

    }

}

function onScanFailure(error) {
    // Kosongkan saja
}

/* =========================
   TOMBOL SCAN
========================= */

document.getElementById("scanOperator")
.addEventListener("click", () => {
    startScan("operator");
});

document.getElementById("scanDeviceHandphone")
.addEventListener("click", () => {
    startScan("deviceHandphone");
});

document.getElementById("scanDeviceScanner")
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

    // Validasi
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

    document.getElementById("operatorView")
    .textContent = "-";

    document.getElementById("hpView")
    .textContent = "-";

    document.getElementById("scannerView")
    .textContent = "-";

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
   TOMBOL SUBMIT
========================= */

document
.getElementById("submit")
.addEventListener("click", submitData);
