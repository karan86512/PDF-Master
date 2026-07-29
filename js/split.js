const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");
const splitBtn = document.getElementById("splitBtn");
const splitPage = document.getElementById("splitPage");

let pdfFile = null;

// Browse
browseBtn.addEventListener("click", () => upload.click());

// Select File
upload.addEventListener("change", e => {
    if (e.target.files.length) {
        addFile(e.target.files[0]);
    }
});

// Drag Over
dropArea.addEventListener("dragover", e => {
    e.preventDefault();
    dropArea.style.borderColor = "#E5322D";
});

// Drag Leave
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

    if(file.type!=="application/pdf"){
        alert("Please select a PDF file.");
        return;
    }

    pdfFile=file;

    renderFile();

}

// Render File
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

<button class="remove" onclick="removeFile()">

<i class="fa-solid fa-trash"></i>

</button>

</div>

`;

}

// Remove
function removeFile(){

pdfFile=null;

splitPage.value="";

fileList.innerHTML=`
<div class="empty">
No PDF Selected
</div>
`;

}

// Download Helper
function downloadPDF(bytes,name){

const blob=new Blob([bytes],{
type:"application/pdf"
});

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download=name;

document.body.appendChild(a);

a.click();

document.body.removeChild(a);

URL.revokeObjectURL(url);

}

// Split
splitBtn.addEventListener("click",async()=>{

if(!pdfFile){
alert("Please select a PDF.");
return;
}

const splitAt=parseInt(splitPage.value);

if(isNaN(splitAt)||splitAt<1){
alert("Enter a valid page number.");
return;
}

try{

splitBtn.disabled=true;

splitBtn.innerHTML=`
<i class="fa-solid fa-spinner fa-spin"></i>
Splitting...
`;

const bytes=await pdfFile.arrayBuffer();

const sourcePdf=await PDFLib.PDFDocument.load(bytes);

const totalPages=sourcePdf.getPageCount();

if(splitAt>=totalPages){

alert("Split page must be smaller than total pages.");

splitBtn.disabled=false;

splitBtn.innerHTML=`
<i class="fa-solid fa-scissors"></i>
Split PDF
`;

return;

}

// Part 1
const pdf1=await PDFLib.PDFDocument.create();

const firstPages=await pdf1.copyPages(
sourcePdf,
Array.from({length:splitAt},(_,i)=>i)
);

firstPages.forEach(page=>pdf1.addPage(page));

// Part 2
const pdf2=await PDFLib.PDFDocument.create();

const secondPages=await pdf2.copyPages(
sourcePdf,
Array.from(
{length:totalPages-splitAt},
(_,i)=>i+splitAt
)
);

secondPages.forEach(page=>pdf2.addPage(page));

const bytes1=await pdf1.save();

const bytes2=await pdf2.save();

downloadPDF(bytes1,"Part-1.pdf");

setTimeout(()=>{

downloadPDF(bytes2,"Part-2.pdf");

},500);

splitBtn.disabled=false;

splitBtn.innerHTML=`
<i class="fa-solid fa-scissors"></i>
Split PDF
`;

}catch(err){

console.error(err);

alert("Failed to split PDF.");

splitBtn.disabled=false;

splitBtn.innerHTML=`
<i class="fa-solid fa-scissors"></i>
Split PDF
`;

}

});