const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const protectBtn = document.getElementById("protectBtn");

let pdfFile = null;

// Browse

browseBtn.addEventListener("click", () => {

    upload.click();

});

// Select

upload.addEventListener("change", e => {

    if(e.target.files.length){

        addFile(e.target.files[0]);

    }

});

// Drag

dropArea.addEventListener("dragover", e => {

    e.preventDefault();

    dropArea.style.borderColor="#E5322D";

});

dropArea.addEventListener("dragleave",()=>{

    dropArea.style.borderColor="#D8D8D8";

});

// Drop

dropArea.addEventListener("drop",e=>{

    e.preventDefault();

    dropArea.style.borderColor="#D8D8D8";

    if(e.dataTransfer.files.length){

        addFile(e.dataTransfer.files[0]);

    }

});

// Add File

function addFile(file){

    if(file.type!=="application/pdf"){

        alert("Please select a PDF.");

        return;

    }

    pdfFile=file;

    renderFile();

}

// Render

function renderFile(){

fileList.innerHTML=`

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

<button class="remove"

onclick="removeFile()">

<i class="fa-solid fa-trash"></i>

</button>

</div>

`;

}

// Remove

function removeFile(){

pdfFile=null;

password.value="";

confirmPassword.value="";

fileList.innerHTML=`

<div class="empty">

No PDF Selected

</div>

`;

}

// Protect

protectBtn.addEventListener("click",()=>{

if(!pdfFile){

alert("Please select a PDF.");

return;

}

if(password.value===""){

alert("Enter password.");

return;

}

if(password.value.length<4){

alert("Password should contain at least 4 characters.");

return;

}

if(password.value!==confirmPassword.value){

alert("Passwords do not match.");

return;

}

protectBtn.disabled=true;

protectBtn.innerHTML=`

<i class="fa-solid fa-spinner fa-spin"></i>

Protecting...

`;

setTimeout(()=>{

alert("Frontend version ready.\n\nReal PDF password protection requires a backend or a PDF encryption library.");

protectBtn.disabled=false;

protectBtn.innerHTML=`

<i class="fa-solid fa-lock"></i>

Protect PDF

`;

},2500);

});