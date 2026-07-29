const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const previewContainer = document.getElementById("previewContainer");
const convertBtn = document.getElementById("convertBtn");

let selectedPDF = null;

// Browse
browseBtn.addEventListener("click", () => {
    upload.click();
});

// File Select
upload.addEventListener("change", (e) => {

    if (e.target.files.length) {

        loadPDF(e.target.files[0]);

    }

});

// Drag Over
dropArea.addEventListener("dragover", (e) => {

    e.preventDefault();

    dropArea.style.borderColor = "#E5322D";

});

// Drag Leave
dropArea.addEventListener("dragleave", () => {

    dropArea.style.borderColor = "#d8d8d8";

});

// Drop
dropArea.addEventListener("drop", (e) => {

    e.preventDefault();

    dropArea.style.borderColor = "#d8d8d8";

    if (e.dataTransfer.files.length) {

        loadPDF(e.dataTransfer.files[0]);

    }

});

// Load PDF
function loadPDF(file){

    if(file.type !== "application/pdf"){

        alert("Please select a PDF file.");

        return;

    }

    selectedPDF = file;

    previewContainer.innerHTML = `

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

// Convert
convertBtn.addEventListener("click", async ()=>{

    if(!selectedPDF){

        alert("Please select a PDF.");

        return;

    }

    previewContainer.innerHTML="<h2>Converting...</h2>";

    const arrayBuffer = await selectedPDF.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data:arrayBuffer
    }).promise;

    previewContainer.innerHTML="";

    for(let i=1;i<=pdf.numPages;i++){

        const page = await pdf.getPage(i);

        const viewport = page.getViewport({
            scale:2
        });

        const canvas = document.createElement("canvas");

        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;

        canvas.height = viewport.height;

        await page.render({

            canvasContext:ctx,

            viewport

        }).promise;

        const image = document.createElement("img");

        image.src = canvas.toDataURL("image/jpeg",1);

        image.style.width="100%";

        image.style.borderRadius="10px";

        image.style.marginBottom="15px";

        const download = document.createElement("a");

        download.href=image.src;

        download.download=`Page-${i}.jpg`;

        download.className="download-btn";

        download.innerHTML="Download JPG";

        const box=document.createElement("div");

        box.className="image-box";

        box.appendChild(image);

        box.appendChild(download);

        previewContainer.appendChild(box);

    }

});