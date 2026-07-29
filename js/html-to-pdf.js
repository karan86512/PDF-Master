const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");
const fileList = document.getElementById("fileList");
const preview = document.getElementById("preview");
const convertBtn = document.getElementById("convertBtn");

let htmlContent = "";

// Browse
browseBtn.addEventListener("click", () => {
    upload.click();
});

// Upload
upload.addEventListener("change", (e) => {
    if (e.target.files.length) {
        loadHTML(e.target.files[0]);
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
        loadHTML(e.dataTransfer.files[0]);
    }

});

// Load HTML
function loadHTML(file){

    if(!file.name.endsWith(".html") && !file.name.endsWith(".htm")){

        alert("Please select an HTML file.");

        return;

    }

    const reader = new FileReader();

    reader.onload = function(e){

        htmlContent = e.target.result;

        preview.innerHTML = htmlContent;

        fileList.innerHTML = `

        <div class="file-card">

            <div class="file-left">

                <i class="fa-brands fa-html5"></i>

                <div>

                    <div class="file-name">

                        ${file.name}

                    </div>

                    <div class="file-size">

                        ${(file.size/1024).toFixed(2)} KB

                    </div>

                </div>

            </div>

        </div>

        `;

    };

    reader.readAsText(file);

}

// Convert
convertBtn.addEventListener("click", async()=>{

    if(htmlContent===""){

        alert("Please upload HTML.");

        return;

    }

    convertBtn.disabled = true;

    convertBtn.innerHTML = `

    <i class="fa-solid fa-spinner fa-spin"></i>

    Converting...

    `;

    const canvas = await html2canvas(preview,{

        scale:2,

        useCORS:true

    });

    const img = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p","mm","a4");

    const pdfWidth = 210;

    const pdfHeight = canvas.height * pdfWidth / canvas.width;

    pdf.addImage(img,"PNG",0,0,pdfWidth,pdfHeight);

    pdf.save("HTML-to-PDF.pdf");

    convertBtn.disabled = false;

    convertBtn.innerHTML = `

    <i class="fa-solid fa-file-pdf"></i>

    Convert to PDF

    `;

});