const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");

const password = document.getElementById("password");
const unlockBtn = document.getElementById("unlockBtn");

let pdfFile = null;

// Browse
browseBtn.addEventListener("click", () => {

    upload.click();

});

// Select
upload.addEventListener("change", e => {

    if (e.target.files.length) {

        addFile(e.target.files[0]);

    }

});

// Drag
dropArea.addEventListener("dragover", e => {

    e.preventDefault();

    dropArea.style.borderColor = "#E5322D";

});

dropArea.addEventListener("dragleave", () => {

    dropArea.style.borderColor = "#D8D8D8";

});

// Drop
dropArea.addEventListener("drop", e => {

    e.preventDefault();

    dropArea.style.borderColor = "#D8D8D8";

    if (e.dataTransfer.files.length) {

        addFile(e.dataTransfer.files[0]);

    }

});

// Add File
function addFile(file){

    if(file.type !== "application/pdf"){

        alert("Please select a PDF file.");

        return;

    }

    pdfFile = file;

    renderFile();

}

// Render
function renderFile(){

    fileList.innerHTML = `

    <div class="file-card">

        <div class="file-left">

            <i class="fa-solid fa-file-pdf"></i>

            <div>

                <div class="file-name">

                    ${pdfFile.name}

                </div>

                <div class="file-size">

                    ${(pdfFile.size/1024/1024).toFixed(2)} MB

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
function removeFile(){

    pdfFile = null;

    password.value = "";

    fileList.innerHTML = `

    <div class="empty">

        No PDF Selected

    </div>

    `;

}

// Unlock
unlockBtn.addEventListener("click", () => {

    if(!pdfFile){

        alert("Please select a PDF.");

        return;

    }

    if(password.value.trim() === ""){

        alert("Please enter the PDF password.");

        return;

    }

    unlockBtn.disabled = true;

    unlockBtn.innerHTML = `

    <i class="fa-solid fa-spinner fa-spin"></i>

    Unlocking...

    `;

    setTimeout(() => {

        alert("Frontend version ready.\n\nReal PDF unlocking requires a backend or a PDF library that supports encrypted PDFs.");

        unlockBtn.disabled = false;

        unlockBtn.innerHTML = `

        <i class="fa-solid fa-lock-open"></i>

        Unlock PDF

        `;

    }, 2500);

});