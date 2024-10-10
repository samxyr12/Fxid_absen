 // Pastikan library HTML5-QRCode dimuat
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Load HTML5-QRCode library
loadScript("https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.4/html5-qrcode.min.js", initializeApp);

function initializeApp() {
    // Fungsi untuk membuat QR Code
    function createQRCode(name, id) {
        const qrData = JSON.stringify({ name, id });
        localStorage.setItem(id, qrData); // Simpan data ke localStorage

        // Menghasilkan QR Code
        const qrCodeDiv = document.getElementById('qrCode');
        qrCodeDiv.innerHTML = ''; // Kosongkan sebelumnya

        const qrCodeImg = document.createElement('img');
        qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200`;
        qrCodeDiv.appendChild(qrCodeImg);

        return "QR Code berhasil dibuat!";
    }

    // Fungsi untuk memindai QR Code
    function scanQRCode() {
        const html5QrcodeScanner = new Html5Qrcode("reader");
        html5QrcodeScanner.start(
            { facingMode: "environment" }, // Menggunakan kamera belakang
            {
                fps: 10,
                qrbox: { width: 250, height: 250 } // Ukuran kotak QR Code
            },
            (decodedText, decodedResult) => {
                const storedData = localStorage.getItem(JSON.parse(decodedText).id);
                
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    document.getElementById('absentMessage').textContent = "Absensi berhasil untuk " + parsedData.name + "!";
                } else {
                    document.getElementById('absentMessage').textContent = "Absensi gagal, data tidak ditemukan!";
                }
            },
            (errorMessage) => {
                console.log(`Error scanning QR Code: ${errorMessage}`);
            }
        ).catch(err => {
            console.error("Error starting QR scanner: ", err);
        });
    }

    // Event listener untuk form pembuatan QR Code
    document.getElementById('qrForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const id = document.getElementById('id').value;
        const message = createQRCode(name, id);
        document.getElementById('message').textContent = message;
        document.getElementById('goToAbsen').style.display = "block"; // Tampilkan tautan ke halaman absensi
    });

    // Event listener untuk pergi ke halaman absensi
    document.getElementById('goToAbsen').addEventListener('click', function () {
        const container = document.querySelector('.container');
        container.innerHTML = `
            <h1>Absensi dengan QR Code</h1>
            <div id="reader"></div>
            <p id="absentMessage"></p>
            <a href="index.html" id="goBack">Kembali</a>
        `;
        scanQRCode(); // Mulai memindai QR code

        document.getElementById('goBack').addEventListener('click', function () {
            location.reload(); // Kembali ke halaman awal
        });
    });
}