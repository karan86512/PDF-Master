const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");
const removeBtn = document.getElementById("removeBtn");
const removePages = document.getElementById("removePages");

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

// Remove File
function removeFile() {

    pdfFile = null;

    removePages.value = "";

    fileList.innerHTML = `
    <div class="empty">
        No PDF Selected
    </div>
    `;

}

// Parse Page Numbers
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

            let page = Number(part);

            if (page >= 1 && page <= totalPages) {
                pages.push(page - 1);
            }

        }

    });

    return [...new Set(pages)];

}

// Remove Pages
removeBtn.addEventListener("click", async () => {

    if (!pdfFile) {
        alert("Please select a PDF.");
        return;
    }

    if (!removePages.value.trim()) {
        alert("Enter page numbers.");
        return;
    }

    try {

        removeBtn.disabled = true;
        removeBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Removing...
        `;

        const bytes = await pdfFile.arrayBuffer();

        const sourcePdf = await PDFLib.PDFDocument.load(bytes);

        const totalPages = sourcePdf.getPageCount();

        const pagesToRemove = parsePages(removePages.value, totalPages);

        const newPdf = await PDFLib.PDFDocument.create();

        const keepPages = [];

        for (let i = 0; i < totalPages; i++) {

            if (!pagesToRemove.includes(i)) {
                keepPages.push(i);
            }

        }

        if (keepPages.length === 0) {

            alert("You cannot remove all pages.");

            removeBtn.disabled = false;
            removeBtn.innerHTML = `
            <i class="fa-solid fa-trash"></i>
            Remove Pages
            `;

            return;

        }

        const copiedPages = await newPdf.copyPages(sourcePdf, keepPages);

        copiedPages.forEach(page => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();

        const blob = new Blob([pdfBytes], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "Updated-PDF.pdf";

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        removeBtn.disabled = false;
        removeBtn.innerHTML = `
        <i class="fa-solid fa-trash"></i>
        Remove Pages
        `;

    } catch (error) {

        console.error(error);

        alert("Failed to remove pages.");

        removeBtn.disabled = false;
        removeBtn.innerHTML = `
        <i class="fa-solid fa-trash"></i>
        Remove Pages
        `;
    }

});