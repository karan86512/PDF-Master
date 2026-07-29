const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");

const signBtn = document.getElementById("signBtn");
const clearBtn = document.getElementById("clearBtn");

const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");

let pdfFile = null;
let drawing = false;

// Canvas Style
ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.strokeStyle = "#000";

// Browse
browseBtn.addEventListener("click", () => {
    upload.click();
});

// Upload
upload.addEventListener("change", (e) => {
    if (e.target.files.length) {
        addFile(e.target.files[0]);
    }
});

// Drag
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#E5322D";
});

dropArea.addEventListener("dragleave", () => {
    dropArea.style.borderColor = "#D8D8D8";
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#D8D8D8";

    if (e.dataTransfer.files.length) {
        addFile(e.dataTransfer.files[0]);
    }
});

// Add PDF
function addFile(file){

    if(file.type !== "application/pdf"){

        alert("Please select a PDF.");

        return;

    }

    pdfFile = file;

    fileList.innerHTML = `
    <div class="file-card">

        <div class="file-left">

            <i class="fa-solid fa-file-pdf"></i>

            <div>

                <div class="file-name">${file.name}</div>

                <div class="file-size">
                ${(file.size/1024/1024).toFixed(2)} MB
                </div>

            </div>

        </div>

    </div>
    `;

}

// Mouse Draw
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);

// Touch Draw
canvas.addEventListener("touchstart", touchStart);
canvas.addEventListener("touchmove", touchMove);
canvas.addEventListener("touchend", stopDraw);

function startDraw(e){

    drawing = true;

    ctx.beginPath();

    ctx.moveTo(e.offsetX,e.offsetY);

}

function draw(e){

    if(!drawing) return;

    ctx.lineTo(e.offsetX,e.offsetY);

    ctx.stroke();

}

function stopDraw(){

    drawing = false;

}

function touchStart(e){

    e.preventDefault();

    const rect = canvas.getBoundingClientRect();

    const touch = e.touches[0];

    drawing = true;

    ctx.beginPath();

    ctx.moveTo(

        touch.clientX-rect.left,

        touch.clientY-rect.top

    );

}

function touchMove(e){

    e.preventDefault();

    if(!drawing) return;

    const rect = canvas.getBoundingClientRect();

    const touch = e.touches[0];

    ctx.lineTo(

        touch.clientX-rect.left,

        touch.clientY-rect.top

    );

    ctx.stroke();

}

// Clear
clearBtn.addEventListener("click",()=>{

    ctx.clearRect(0,0,canvas.width,canvas.height);

});

// Sign PDF
signBtn.addEventListener("click",async()=>{

    if(!pdfFile){

        alert("Please select a PDF.");

        return;

    }

    signBtn.disabled = true;

    signBtn.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin"></i>
    Signing...
    `;

    try{

        const bytes = await pdfFile.arrayBuffer();

        const pdfDoc = await PDFLib.PDFDocument.load(bytes);

        const page = pdfDoc.getPages()[0];

        const png = canvas.toDataURL("image/png");

        const imgBytes = await fetch(png).then(r=>r.arrayBuffer());

        const image = await pdfDoc.embedPng(imgBytes);

        page.drawImage(image,{

            x:50,

            y:50,

            width:180,

            height:70

        });

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes],{

            type:"application/pdf"

        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "Signed-PDF.pdf";

        a.click();

        URL.revokeObjectURL(url);

    }

    catch(err){

        console.error(err);

        alert("Failed to sign PDF.");

    }

    signBtn.disabled = false;

    signBtn.innerHTML = `
    <i class="fa-solid fa-signature"></i>
    Sign PDF
    `;

});