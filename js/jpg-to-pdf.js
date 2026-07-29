const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");
const convertBtn = document.getElementById("convertBtn");

let imageFiles = [];

// Browse
browseBtn.addEventListener("click", () => upload.click());

// Select Images
upload.addEventListener("change", (e) => {
    addFiles([...e.target.files]);
});

// Drag Over
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#E5322D";
});

// Drag Leave
dropArea.addEventListener("dragleave", () => {
    dropArea.style.borderColor = "#D8D8D8";
});

// Drop
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#D8D8D8";
    addFiles([...e.dataTransfer.files]);
});

// Add Images
function addFiles(files) {

    files.forEach(file => {

        if (file.type.startsWith("image/")) {

            imageFiles.push(file);

        }

    });

    renderFiles();

}

// Render Images
function renderFiles() {

    if (imageFiles.length === 0) {

        fileList.innerHTML = `
        <div class="empty">
            No Images Selected
        </div>
        `;

        return;

    }

    fileList.innerHTML = "";

    imageFiles.forEach((file, index) => {

        fileList.innerHTML += `

        <div class="file-card">

            <div class="file-left">

                <i class="fa-solid fa-image"></i>

                <div>

                    <div class="file-name">
                        ${file.name}
                    </div>

                    <div class="file-size">
                        ${(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>

                </div>

            </div>

            <button class="remove"
            onclick="removeImage(${index})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

    });

}

// Remove
function removeImage(index) {

    imageFiles.splice(index, 1);

    renderFiles();

}

// Convert
convertBtn.addEventListener("click", async () => {

    if (imageFiles.length === 0) {

        alert("Please select images.");

        return;

    }

    try {

        convertBtn.disabled = true;

        convertBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Converting...
        `;

        const pdfDoc = await PDFLib.PDFDocument.create();

        for (const file of imageFiles) {

            const bytes = await file.arrayBuffer();

            let image;

            if (file.type === "image/png") {

                image = await pdfDoc.embedPng(bytes);

            } else {

                image = await pdfDoc.embedJpg(bytes);

            }

            const page = pdfDoc.addPage([
                image.width,
                image.height
            ]);

            page.drawImage(image, {

                x: 0,

                y: 0,

                width: image.width,

                height: image.height

            });

        }

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes], {

            type: "application/pdf"

        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "Images-to-PDF.pdf";

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        convertBtn.disabled = false;

        convertBtn.innerHTML = `
        <i class="fa-solid fa-file-pdf"></i>
        Convert to PDF
        `;

    } catch (err) {

        console.error(err);

        alert("Conversion Failed.");

        convertBtn.disabled = false;

        convertBtn.innerHTML = `
        <i class="fa-solid fa-file-pdf"></i>
        Convert to PDF
        `;

    }

});