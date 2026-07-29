const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");
const rotateBtn = document.getElementById("rotateBtn");
const rotationSelect = document.getElementById("rotation");

let pdfFile = null;

// Browse Button
browseBtn.addEventListener("click", () => {
    upload.click();
});

// File Selection
upload.addEventListener("change", (e) => {
    if (e.target.files.length) {
        addFile(e.target.files[0]);
    }
});

// Drag Over
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#E5322D";
    dropArea.style.background = "#fff5f5";
});

// Drag Leave
dropArea.addEventListener("dragleave", () => {
    dropArea.style.borderColor = "#d8d8d8";
    dropArea.style.background = "#fff";
});

// Drop
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();

    dropArea.style.borderColor = "#d8d8d8";
    dropArea.style.background = "#fff";

    if (e.dataTransfer.files.length) {
        addFile(e.dataTransfer.files[0]);
    }
});

// Add File
function addFile(file) {

    if (file.type !== "application/pdf") {
        alert("Please select a PDF file.");
        return;
    }

    pdfFile = file;
    renderFile();
}

// Show Selected File
function renderFile() {

    fileList.innerHTML = `
        <div class="file-card">

            <div class="file-left">

                <i class="fa-solid fa-file-pdf"></i>

                <div>

                    <div class="file-name">${pdfFile.name}</div>

                    <div class="file-size">
                        ${(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>

                </div>

            </div>

            <button class="remove" onclick="removeFile()">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>
    `;

    rotateBtn.disabled = false;
}

// Remove File
function removeFile() {

    pdfFile = null;

    fileList.innerHTML = `
        <div class="empty">
            No PDF Selected
        </div>
    `;

    rotateBtn.disabled = true;
}

// Rotate PDF
rotateBtn.addEventListener("click", async () => {

    if (!pdfFile) {
        alert("Please select a PDF file.");
        return;
    }

    try {

        rotateBtn.disabled = true;
        rotateBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Rotating...
        `;

        const degrees = parseInt(rotationSelect.value);

        const bytes = await pdfFile.arrayBuffer();

        const pdfDoc = await PDFLib.PDFDocument.load(bytes);

        const pages = pdfDoc.getPages();

        pages.forEach(page => {

            page.setRotation(
                PDFLib.degrees(degrees)
            );

        });

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "Rotated-PDF.pdf";

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        rotateBtn.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            Rotate PDF
        `;

        rotateBtn.disabled = false;

    } catch (err) {

        console.error(err);

        alert("Error rotating PDF.");

        rotateBtn.innerHTML = `
            <i class="fa-solid fa-rotate-right"></i>
            Rotate PDF
        `;

        rotateBtn.disabled = false;
    }

});