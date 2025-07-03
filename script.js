let qrCodes = [];
let currentIndex = 0;

document.getElementById('imageInput').addEventListener('change', async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    const result = await Tesseract.recognize(image, 'eng');
    const text = result.data.text.replace(/SPXIDO/g, "SPXID0");
    qrCodes = text.match(/\bSPXID0\d{11}\b/g) || [];

    if (qrCodes.length === 0) {
        document.getElementById('carousel').innerHTML = "⚠️ No valid SPXIDs found.";
        document.getElementById('counterText').textContent = "";
        return;
    }

    currentIndex = 0;
    showQRCode(currentIndex);
});

function showQRCode(index) {
    const code = qrCodes[index];
    const container = document.getElementById('carousel');
    container.innerHTML = '';

    const canvas = document.createElement('div');
    const label = document.createElement('p');
    label.textContent = code;

    new QRCode(canvas, { text: code, width: 360, height: 360 });
    container.appendChild(canvas);
    container.appendChild(label);

    document.getElementById('counterText').textContent = `Showing ${index + 1} of ${qrCodes.length}`;
}

document.getElementById('prevBtn').onclick = () => {
    if (currentIndex > 0) {
        currentIndex--;
        showQRCode(currentIndex);
    }
};

document.getElementById('nextBtn').onclick = () => {
    if (currentIndex < qrCodes.length - 1) {
        currentIndex++;
        showQRCode(currentIndex);
    }
};

// Swipe support
let startX = 0;
const qrArea = document.getElementById('qr-container');

qrArea.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

qrArea.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 30 && currentIndex > 0) {
        currentIndex--;
        showQRCode(currentIndex);
    } else if (startX - endX > 30 && currentIndex < qrCodes.length - 1) {
        currentIndex++;
        showQRCode(currentIndex);
    }
});
