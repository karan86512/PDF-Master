const upload = document.getElementById("upload");
const browseBtn = document.getElementById("browseBtn");
const fileList = document.getElementById("fileList");
const createBtn = document.getElementById("createBtn");

let images = [];

// Open Camera / Gallery
browseBtn.addEventListener("click", () => {
    upload.click();
});

// Select Images
upload.addEventListener("change", (e) => {

    const files = [...e.target.files];

    files.forEach(file => {

        if(file.type.startsWith("image/")){

            images.push(file);

        }

    });

    renderImages();

});

// Show Images
function renderImages(){

    if(images.length===0){

        fileList.innerHTML=`
        <div class="empty">
            No Images Selected
        </div>
        `;

        return;

    }

    fileList.innerHTML="";

    images.forEach((file,index)=>{

        const url=URL.createObjectURL(file);

        fileList.innerHTML+=`

        <div class="file-card">

            <div class="file-left">

                <img src="${url}"
                style="width:60px;height:80px;border-radius:8px;object-fit:cover;">

                <div>

                    <div class="file-name">
                        ${file.name}
                    </div>

                    <div class="file-size">
                        ${(file.size/1024/1024).toFixed(2)} MB
                    </div>

                </div>

            </div>

            <button
            class="remove"
            onclick="removeImage(${index})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

    });

}

// Remove Image
function removeImage(index){

    images.splice(index,1);

    renderImages();

}

// Create PDF
createBtn.addEventListener("click",async()=>{

    if(images.length===0){

        alert("Please select images.");

        return;

    }

    try{

        createBtn.disabled=true;

        createBtn.innerHTML=`
        <i class="fa-solid fa-spinner fa-spin"></i>
        Creating PDF...
        `;

        const pdfDoc=await PDFLib.PDFDocument.create();

        for(const file of images){

            const bytes=await file.arrayBuffer();

            let image;

            if(file.type==="image/png"){

                image=await pdfDoc.embedPng(bytes);

            }else{

                image=await pdfDoc.embedJpg(bytes);

            }

            const page=pdfDoc.addPage([
                image.width,
                image.height
            ]);

            page.drawImage(image,{
                x:0,
                y:0,
                width:image.width,
                height:image.height
            });

        }

        const pdfBytes=await pdfDoc.save();

        const blob=new Blob([pdfBytes],{
            type:"application/pdf"
        });

        const url=URL.createObjectURL(blob);

        const a=document.createElement("a");

        a.href=url;

        a.download="Scanned-Document.pdf";

        a.click();

        URL.revokeObjectURL(url);

        createBtn.disabled=false;

        createBtn.innerHTML=`
        <i class="fa-solid fa-file-pdf"></i>
        Create PDF
        `;

    }

    catch(error){

        console.error(error);

        alert("Failed to create PDF.");

        createBtn.disabled=false;

        createBtn.innerHTML=`
        <i class="fa-solid fa-file-pdf"></i>
        Create PDF
        `;

    }

});