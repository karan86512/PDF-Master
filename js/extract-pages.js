const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");
const extractBtn = document.getElementById("extractBtn");
const pageRange = document.getElementById("pageRange");

let pdfFile = null;

// Browse
browseBtn.addEventListener("click", () => {
    upload.click();
});

// Select File
upload.addEventListener("change", (e) => {
    if (e.target.files.length) {
        addFile(e.target.files[0]);
    }
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

// Render File
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

}

// Remove
function removeFile() {

    pdfFile = null;

    pageRange.value = "";

    fileList.innerHTML = `
    <div class="empty">
        No PDF Selected
    </div>
    `;

}

// Parse Range
function parsePages(input, totalPages) {

    let pages = [];

    input.split(",").forEach(part => {

        part = part.trim();

        if (part.includes("-")) {

            let [start, end] = part.split("-").map(Number);

            for (let i = start; i <= end; i++) {

                if (i >= 1 && i <= totalPages) {
                    pages.push(i - 1);
                }

            }

        } else {

            let p = Number(part);

            if (p >= 1 && p <= totalPages) {
                pages.push(p - 1);
            }

        }

    });

    return [...new Set(pages)];

}

// Extract
extractBtn.addEventListener("click", async () => {

    if (!pdfFile) {
        alert("Please select a PDF.");
        return;
    }

    if (!pageRange.value.trim()) {
        alert("Enter page numbers.");
        return;
    }

    try {

        extractBtn.disabled = true;

        extractBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Extracting...
        `;

        const bytes = await pdfFile.arrayBuffer();

        const sourcePdf = await PDFLib.PDFDocument.load(bytes);

        const totalPages = sourcePdf.getPageCount();

        const pages = parsePages(pageRange.value, totalPages);

        if (pages.length === 0) {

            alert("Invalid page numbers.");

            extractBtn.disabled = false;

            extractBtn.innerHTML = `
            <i class="fa-solid fa-copy"></i>
            Extract Pages
            `;

            return;

        }

        const newPdf = await PDFLib.PDFDocument.create();

        const copiedPages = await newPdf.copyPages(sourcePdf, pages);

        copiedPages.forEach(page => {

            newPdf.addPage(page);

        });

        const pdfBytes = await newPdf.save();

        const blob = new Blob([pdfBytes], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "Extracted-Pages.pdf";

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        extractBtn.disabled = false;

        extractBtn.innerHTML = `
        <i class="fa-solid fa-copy"></i>
        Extract Pages
        `;

    } catch (err) {

        console.error(err);

        alert("Failed to extract pages.");

        extractBtn.disabled = false;

        extractBtn.innerHTML = `
        <i class="fa-solid fa-copy"></i>
        Extract Pages
        `;

    }

});