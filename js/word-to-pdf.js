const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");
const convertBtn = document.getElementById("convertBtn");

let wordFile = null;

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
function addFile(file){

    const ext = file.name.split(".").pop().toLowerCase();

    if(ext !== "doc" && ext !== "docx"){
        alert("Please select a Word file.");
        return;
    }

    wordFile = file;

    renderFile();

}

// Render
function renderFile(){

    fileList.innerHTML = `
    <div class="file-card">

        <div class="file-left">

            <i class="fa-solid fa-file-word"></i>

            <div>

                <div class="file-name">${wordFile.name}</div>

                <div class="file-size">
                    ${(wordFile.size/1024/1024).toFixed(2)} MB
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

    wordFile = null;

    fileList.innerHTML = `
    <div class="empty">

        No Word File Selected

    </div>
    `;

}

// Convert
convertBtn.addEventListener("click", () => {

    if(!wordFile){

        alert("Please select a Word file.");

        return;

    }

    convertBtn.disabled = true;

    convertBtn.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin"></i>
    Converting...
    `;

    setTimeout(()=>{

        alert("Word to PDF conversion requires a backend service or desktop conversion engine.");

        convertBtn.disabled = false;

        convertBtn.innerHTML = `
        <i class="fa-solid fa-file-pdf"></i>
        Convert to PDF
        `;

    },2000);

});