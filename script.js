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

    document.getElementById(currentField).value =
        decodedText;

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

    document.getElementById("reader").innerHTML = "";
}

/* =========================
   SCAN FAILURE
========================= */

function onScanFailure(error) {
    // kosong
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
   DEVICE TYPE
========================= */

document
.getElementById("deviceType")
.addEventListener("change", function(){

    const type = this.value;

    const hpSection =
        document.getElementById("hpSection");

    const scannerSection =
        document.getElementById("scannerSection");

    if(type === "SCANNER"){

        hpSection.style.display = "none";
        scannerSection.style.display = "block";

        document.getElementById("deviceHandphone")
        .value = "";

    }
    else if(type === "HANDPHONE"){

        hpSection.style.display = "block";
        scannerSection.style.display = "none";

        document.getElementById("deviceScanner")
        .value = "";

    }
    else if(type === "SCANNER_HP"){

        hpSection.style.display = "block";
        scannerSection.style.display = "block";

    }
    else{

        hpSection.style.display = "block";
        scannerSection.style.display = "block";

    }

});

/* =========================
   SUBMIT DATA
========================= */

function submitData() {

    const operator =
        document.getElementById("operator").value;

    const shift =
        document.getElementById("shift").value;

    const deviceType =
        document.getElementById("deviceType").value;

    const deviceHandphone =
        document.getElementById("deviceHandphone").value;

    const deviceScanner =
        document.getElementById("deviceScanner").value;

    const status =
        document.getElementById("status").value;

    /* VALIDASI */

    if(!operator){

        alert("Scan Operator terlebih dahulu");
        return;

    }

    if(!shift){

    alert("Pilih Shift");
    return;

    }

    if(!deviceType){

        alert("Pilih Jenis Device");
        return;

    }

    if(
        deviceType === "SCANNER" &&
        !deviceScanner
    ){

        alert("Scan Device Scanner");
        return;

    }

    if(
        deviceType === "HANDPHONE" &&
        !deviceHandphone
    ){

        alert("Scan Device Handphone");
        return;

    }

    if(
        deviceType === "SCANNER_HP" &&
        (
            !deviceHandphone ||
            !deviceScanner
        )
    ){

        alert("Scan Device Handphone dan Scanner");
        return;

    }

    const form =
        document.createElement("form");

    form.method = "POST";

    form.action =
    "https://script.google.com/macros/s/AKfycbwt_8rHMGHdZCrUKrimt80J9mi96FCKzxW2mLP9Izm5CzVhtdiIepPt24d19jOHwRVe9Q/exec"
    form.target = "hiddenFrame";

    const fields = {
        operator,
        shift,
        deviceType,
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
    document.getElementById("shift").value = "";
    document.getElementById("deviceHandphone").value = "";
    document.getElementById("deviceScanner").value = "";
    document.getElementById("deviceType").value = "";

    document.getElementById("hpSection")
    .style.display = "block";

    document.getElementById("scannerSection")
    .style.display = "block";

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

    document.getElementById("reader")
    .innerHTML = "";
}

/* =========================
   SUBMIT BUTTON
========================= */

document
.getElementById("submit")
.addEventListener("click", submitData);
