 const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");
const mergeBtn = document.getElementById("mergeBtn");

let pdfFiles = [];

// Browse Button
browseBtn.addEventListener("click", () => {
    upload.click();
});

// File Select
upload.addEventListener("change", (e) => {
    addFiles(Array.from(e.target.files));
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

// Drop Files
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();

    dropArea.style.borderColor = "#d8d8d8";
    dropArea.style.background = "#fff";

    addFiles(Array.from(e.dataTransfer.files));
});

// Add Files
function addFiles(files) {

    files.forEach(file => {

        if (file.type === "application/pdf") {

            pdfFiles.push(file);

        }

    });

    renderFiles();

}

// Render Files
function renderFiles() {

    if (pdfFiles.length === 0) {

        fileList.innerHTML = `
        <div class="empty">
            No PDF selected.
        </div>
        `;

        mergeBtn.disabled = true;

        return;

    }

    mergeBtn.disabled = false;

    fileList.innerHTML = "";

    pdfFiles.forEach((file, index) => {

        fileList.innerHTML += `

        <div class="file-card">

            <div class="file-left">

                <i class="fa-solid fa-file-pdf"></i>

                <div>

                    <div class="file-name">${file.name}</div>

                    <div class="file-size">
                        ${(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>

                </div>

            </div>

            <button class="remove" onclick="removeFile(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>

        `;

    });

}

// Remove File
function removeFile(index) {

    pdfFiles.splice(index, 1);

    renderFiles();

}

// Merge PDFs
mergeBtn.addEventListener("click", async () => {

    if (pdfFiles.length < 2) {

        alert("Please select at least 2 PDF files.");

        return;

    }

    try {

        mergeBtn.disabled = true;

        mergeBtn.innerHTML = "Merging...";

        const mergedPdf = await PDFLib.PDFDocument.create();

        for (const file of pdfFiles) {

            const bytes = await file.arrayBuffer();

            const pdf = await PDFLib.PDFDocument.load(bytes);

            const copiedPages = await mergedPdf.copyPages(
                pdf,
                pdf.getPageIndices()
            );

            copiedPages.forEach(page => {

                mergedPdf.addPage(page);

            });

        }

        const pdfBytes = await mergedPdf.save();

        const blob = new Blob([pdfBytes], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "Merged-PDF.pdf";

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        mergeBtn.innerHTML = "Merge PDF";

        mergeBtn.disabled = false;

        alert("PDF Merged Successfully!");

    } catch (err) {

        console.error(err);

        alert("Error while merging PDF.");

        mergeBtn.innerHTML = "Merge PDF";

        mergeBtn.disabled = false;

    }

});