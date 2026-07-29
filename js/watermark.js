const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");

const watermarkText = document.getElementById("watermarkText");
const watermarkBtn = document.getElementById("watermarkBtn");

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

        alert("Please select a PDF file.");

        return;

    }

    pdfFile = file;

    renderFile();

}

// Render File
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

// Remove File
function removeFile(){

    pdfFile = null;

    watermarkText.value = "";

    fileList.innerHTML = `

    <div class="empty">

        No PDF Selected

    </div>

    `;

}

// Watermark
watermarkBtn.addEventListener("click", async () => {

    if(!pdfFile){

        alert("Please select a PDF.");

        return;

    }

    if(watermarkText.value.trim()===""){

        alert("Enter watermark text.");

        return;

    }

    try{

        watermarkBtn.disabled = true;

        watermarkBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Processing...
        `;

        const bytes = await pdfFile.arrayBuffer();

        const pdfDoc = await PDFLib.PDFDocument.load(bytes);

        const pages = pdfDoc.getPages();

        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

        pages.forEach(page=>{

            const { width, height } = page.getSize();

            page.drawText(watermarkText.value,{

                x:width/2-120,

                y:height/2,

                size:40,

                font:font,

                opacity:0.20,

                rotate:PDFLib.degrees(45)

            });

        });

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes],{

            type:"application/pdf"

        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "Watermarked-PDF.pdf";

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        watermarkBtn.disabled = false;

        watermarkBtn.innerHTML = `
        <i class="fa-solid fa-droplet"></i>
        Add Watermark
        `;

    }catch(err){

        console.error(err);

        alert("Failed to add watermark.");

        watermarkBtn.disabled = false;

        watermarkBtn.innerHTML = `
        <i class="fa-solid fa-droplet"></i>
        Add Watermark
        `;

    }

});