const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const fileList = document.getElementById("fileList");
const ocrBtn = document.getElementById("ocrBtn");

let pdfFile = null;

// Browse
browseBtn.onclick = () => upload.click();

// Upload
upload.onchange = (e) => {

    if (e.target.files.length) {

        pdfFile = e.target.files[0];

        fileList.innerHTML = `
        <div class="file-card">

            <div class="file-left">

                <i class="fa-solid fa-file-pdf"></i>

                <div>

                    <div class="file-name">${pdfFile.name}</div>

                    <div class="file-size">
                    ${(pdfFile.size/1024/1024).toFixed(2)} MB
                    </div>

                </div>

            </div>

        </div>
        `;

    }

};

// OCR
ocrBtn.onclick = () => {

    if(!pdfFile){

        alert("Please select a PDF.");

        return;

    }

    ocrBtn.disabled = true;

    ocrBtn.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin"></i>
    Processing...
    `;

    setTimeout(()=>{

        alert("Frontend UI ready.\n\nActual OCR requires pdf.js + Tesseract.js or a backend OCR engine.");

        ocrBtn.disabled = false;

        ocrBtn.innerHTML = `
        <i class="fa-solid fa-file-lines"></i>
        Extract Text
        `;

    },2500);

};