const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");
const formFields = document.getElementById("formFields");
const saveBtn = document.getElementById("saveBtn");

let pdfBytes = null;
let pdfDoc = null;
let pdfForm = null;

// Browse
browseBtn.onclick = () => upload.click();

// Select
upload.onchange = e => {
    if (e.target.files.length) {
        loadPDF(e.target.files[0]);
    }
};

// Drag
dropArea.ondragover = e => {
    e.preventDefault();
    dropArea.style.borderColor = "#E5322D";
};

dropArea.ondragleave = () => {
    dropArea.style.borderColor = "#D8D8D8";
};

// Drop
dropArea.ondrop = e => {

    e.preventDefault();

    dropArea.style.borderColor = "#D8D8D8";

    if (e.dataTransfer.files.length) {

        loadPDF(e.dataTransfer.files[0]);

    }

};

// Load PDF
async function loadPDF(file){

    if(file.type !== "application/pdf"){

        alert("Please select a PDF.");

        return;

    }

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

    pdfBytes = await file.arrayBuffer();

    pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

    pdfForm = pdfDoc.getForm();

    createFields();

}

// Create Inputs
function createFields(){

    formFields.innerHTML = "";

    const fields = pdfForm.getFields();

    if(fields.length===0){

        formFields.innerHTML = `
        <div class="empty">
        No Fillable Fields Found
        </div>
        `;

        return;

    }

    fields.forEach(field=>{

        const div = document.createElement("div");

        div.className="pdf-options";

        div.innerHTML = `
        <label>${field.getName()}</label>

        <input
        type="text"
        id="${field.getName()}">
        `;

        formFields.appendChild(div);

    });

}

// Save
saveBtn.onclick = async()=>{

    if(!pdfDoc){

        alert("Please upload a PDF.");

        return;

    }

    const fields = pdfForm.getFields();

    fields.forEach(field=>{

        const input=document.getElementById(field.getName());

        if(input){

            try{

                field.setText(input.value);

            }catch(e){}

        }

    });

    const bytes=await pdfDoc.save();

    const blob=new Blob([bytes],{

        type:"application/pdf"

    });

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="Filled-PDF.pdf";

    a.click();

    URL.revokeObjectURL(url);

};