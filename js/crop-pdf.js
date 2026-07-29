const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");

const leftInput = document.getElementById("left");
const rightInput = document.getElementById("right");
const topInput = document.getElementById("top");
const bottomInput = document.getElementById("bottom");

const cropBtn = document.getElementById("cropBtn");

let pdfFile = null;

// Browse
browseBtn.addEventListener("click", () => {
    upload.click();
});

// Select
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

    if(file.type !== "application/pdf"){
        alert("Please select a PDF.");
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

    fileList.innerHTML = `
    <div class="empty">
        No PDF Selected
    </div>
    `;

}

// Crop
cropBtn.addEventListener("click", async()=>{

    if(!pdfFile){

        alert("Please select a PDF.");

        return;

    }

    try{

        cropBtn.disabled = true;

        cropBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Cropping...
        `;

        const bytes = await pdfFile.arrayBuffer();

        const pdfDoc = await PDFLib.PDFDocument.load(bytes);

        const pages = pdfDoc.getPages();

        const left = Number(leftInput.value) || 0;
        const right = Number(rightInput.value) || 0;
        const top = Number(topInput.value) || 0;
        const bottom = Number(bottomInput.value) || 0;

        pages.forEach(page=>{

            const { width, height } = page.getSize();

            page.setCropBox(

                left,

                bottom,

                width-left-right,

                height-top-bottom

            );

        });

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes],{

            type:"application/pdf"

        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "Cropped-PDF.pdf";

        a.click();

        URL.revokeObjectURL(url);

        cropBtn.disabled = false;

        cropBtn.innerHTML = `
        <i class="fa-solid fa-crop-simple"></i>
        Crop PDF
        `;

    }

    catch(err){

        console.error(err);

        alert("Crop failed.");

        cropBtn.disabled = false;

        cropBtn.innerHTML = `
        <i class="fa-solid fa-crop-simple"></i>
        Crop PDF
        `;

    }

});