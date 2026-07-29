const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");

const position = document.getElementById("position");
const numberBtn = document.getElementById("numberBtn");

let pdfFile = null;

// Browse
browseBtn.addEventListener("click", () => upload.click());

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

// Remove
function removeFile(){

    pdfFile = null;

    fileList.innerHTML = `
    <div class="empty">
        No PDF Selected
    </div>
    `;

}

// Add Numbers
numberBtn.addEventListener("click", async()=>{

    if(!pdfFile){

        alert("Please select a PDF.");

        return;

    }

    try{

        numberBtn.disabled = true;

        numberBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Processing...
        `;

        const bytes = await pdfFile.arrayBuffer();

        const pdfDoc = await PDFLib.PDFDocument.load(bytes);

        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

        const pages = pdfDoc.getPages();

        pages.forEach((page,index)=>{

            const { width,height } = page.getSize();

            let x = width/2;
            let y = 25;

            switch(position.value){

                case "bottom-left":
                    x = 30;
                    y = 25;
                    break;

                case "bottom-center":
                    x = width/2-10;
                    y = 25;
                    break;

                case "bottom-right":
                    x = width-40;
                    y = 25;
                    break;

                case "top-left":
                    x = 30;
                    y = height-30;
                    break;

                case "top-center":
                    x = width/2-10;
                    y = height-30;
                    break;

                case "top-right":
                    x = width-40;
                    y = height-30;
                    break;

            }

            page.drawText(`${index+1}`,{

                x:x,

                y:y,

                size:12,

                font:font,

                color:PDFLib.rgb(0,0,0)

            });

        });

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes],{

            type:"application/pdf"

        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "Page-Numbers.pdf";

        a.click();

        URL.revokeObjectURL(url);

        numberBtn.disabled = false;

        numberBtn.innerHTML = `
        <i class="fa-solid fa-list-ol"></i>
        Add Page Numbers
        `;

    }

    catch(error){

        console.error(error);

        alert("Failed to add page numbers.");

        numberBtn.disabled = false;

        numberBtn.innerHTML = `
        <i class="fa-solid fa-list-ol"></i>
        Add Page Numbers
        `;

    }

});