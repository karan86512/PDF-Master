// =============================
// Theme Toggle
// =============================

 const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

    }else{

        themeBtn.innerHTML =
        '<i class="fa-solid fa-moon"></i>';

    }

});

// =============================
// Search Tool
// =============================

const searchInput =
document.querySelector(".search-box input");

const cards =
document.querySelectorAll(".tool-card");

searchInput?.addEventListener("keyup",()=>{

    const value =
    searchInput.value.toLowerCase();

    cards.forEach(card=>{

        const text =
        card.innerText.toLowerCase();

        card.style.display =
        text.includes(value)
        ? "block"
        : "none";

    });

});

// =============================
// Upload Box
// =============================

const uploadBox =
document.querySelector(".upload-box");

const chooseBtn =
document.querySelector(".upload-box button");

const input =
document.createElement("input");

input.type="file";

input.accept=".pdf";

chooseBtn?.addEventListener("click",()=>{

    input.click();

});

input.addEventListener("change",()=>{

    if(input.files.length){

        uploadBox.innerHTML=`

        <i class="fa-solid fa-file-pdf"></i>

        <h3>${input.files[0].name}</h3>

        <p>

        ${(input.files[0].size/1024/1024).toFixed(2)}

        MB

        </p>

        <button>

        File Selected

        </button>

        `;

    }

});

// =============================
// Drag & Drop
// =============================

uploadBox?.addEventListener("dragover",(e)=>{

    e.preventDefault();

    uploadBox.style.borderColor="#E5322D";

});

uploadBox?.addEventListener("dragleave",()=>{

    uploadBox.style.borderColor="#ddd";

});

uploadBox?.addEventListener("drop",(e)=>{

    e.preventDefault();

    uploadBox.style.borderColor="#ddd";

    const file=e.dataTransfer.files[0];

    if(file){

        uploadBox.innerHTML=`

        <i class="fa-solid fa-file-pdf"></i>

        <h3>${file.name}</h3>

        <p>

        ${(file.size/1024/1024).toFixed(2)}

        MB

        </p>

        <button>

        File Selected

        </button>

        `;

    }

});

// =============================
// Smooth Scroll
// =============================

document.querySelectorAll('a[href^="#"]')
.forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

const target=
document.querySelector(this.getAttribute("href"));

if(target){

target.scrollIntoView({

behavior:"smooth"

});

}

});

});