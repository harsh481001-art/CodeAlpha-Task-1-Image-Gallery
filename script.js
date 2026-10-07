const gallery = document.getElementById("gallery");

const filterButtons = document.querySelectorAll(".filter-btn");

const addImageBtn = document.getElementById("addImageBtn");

const addModal = document.getElementById("addModal");

const modalClose = document.getElementById("modalClose");

const imageForm = document.getElementById("imageForm");

const imageFile = document.getElementById("imageFile");

const imageName = document.getElementById("imageName");

const imageCategory = document.getElementById("imageCategory");


/* LIGHTBOX */

const lightbox = document.getElementById("lightbox");

const lightboxImg = document.getElementById("lightbox-img");

const closeBtn = document.getElementById("closeBtn");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");

const downloadBtn = document.getElementById("downloadBtn");


/* DEFAULT IMAGES */

const defaultImages = [

    {
        src: "images/dog.jpg",
        title: "Dog",
        category: "animals"
    },

    {
        src: "images/mountain.jpg",
        title: "Mountain",
        category: "nature"
    },

    {
        src: "images/beach.jpg",
        title: "Beach",
        category: "nature"
    },

    {
        src: "images/car.jpg",
        title: "Car",
        category: "travel"
    },

    {
        src: "images/india.jpg",
        title: "India",
        category: "travel"
    }

];


/* LOAD SAVED IMAGES */

let savedImages =
    JSON.parse(localStorage.getItem("myGalleryImages")) || [];


/* COMBINE DEFAULT + USER IMAGES */

let allImages = [...defaultImages, ...savedImages];

let currentImages = allImages;

let currentIndex = 0;


/* CATEGORY NAME */

function getCategoryName(category) {

    const names = {
        nature: "🌿 Nature",
        animals: "🐶 Animals",
        travel: "✈️ Travel",
        food: "🍔 Food",
        city: "🏙️ City"
    };

    return names[category] || category;
}


/* DISPLAY GALLERY */

function displayGallery(images) {

    gallery.innerHTML = "";

    images.forEach((image, index) => {

        const card = document.createElement("div");

        card.className = "image-card";

        card.dataset.index = index;

        card.innerHTML = `

            <img src="${image.src}" alt="${image.title}">

            <div class="image-info">

                <h3>${image.title}</h3>

                <p>${getCategoryName(image.category)}</p>

            </div>

        `;

        gallery.appendChild(card);

    });

}


/* INITIAL GALLERY */

displayGallery(allImages);


/* OPEN LIGHTBOX */

gallery.addEventListener("click", function(event) {

    const card = event.target.closest(".image-card");

    if (!card) return;

    currentIndex = Number(card.dataset.index);

    openLightbox();

});


/* OPEN LIGHTBOX FUNCTION */

function openLightbox() {

    const image = currentImages[currentIndex];

    if (!image) return;

    lightboxImg.src = image.src;

    lightboxImg.alt = image.title;

    downloadBtn.href = image.src;

    downloadBtn.download = image.title;

    lightbox.style.display = "flex";

}


/* NEXT IMAGE */

nextBtn.addEventListener("click", function() {

    currentIndex++;

    if (currentIndex >= currentImages.length) {
        currentIndex = 0;
    }

    openLightbox();

});


/* PREVIOUS IMAGE */

prevBtn.addEventListener("click", function() {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = currentImages.length - 1;
    }

    openLightbox();

});


/* CLOSE LIGHTBOX */

closeBtn.addEventListener("click", function() {

    lightbox.style.display = "none";

});


/* CLICK OUTSIDE */

lightbox.addEventListener("click", function(event) {

    if (event.target === lightbox) {

        lightbox.style.display = "none";

    }

});


/* FILTER */

filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        const filter = this.dataset.filter;

        if (filter === "all") {

            currentImages = allImages;

        } else {

            currentImages = allImages.filter(
                image => image.category === filter
            );

        }

        displayGallery(currentImages);

    });

});


/* OPEN ADD IMAGE MODAL */

addImageBtn.addEventListener("click", function() {

    addModal.style.display = "flex";

});


/* CLOSE MODAL */

modalClose.addEventListener("click", function() {

    addModal.style.display = "none";

});


/* CLOSE MODAL OUTSIDE */

addModal.addEventListener("click", function(event) {

    if (event.target === addModal) {

        addModal.style.display = "none";

    }

});


/* ADD NEW IMAGE */

imageForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const file = imageFile.files[0];

    const name = imageName.value.trim();

    const category = imageCategory.value;


    if (!file) {

        alert("Please select an image.");

        return;

    }


    if (!file.type.startsWith("image/")) {

        alert("Please select a valid image file.");

        return;

    }


    const reader = new FileReader();


    reader.onload = function(e) {

        const newImage = {

            src: e.target.result,

            title: name,

            category: category

        };


        /* SAVE IMAGE */

        savedImages.push(newImage);

        localStorage.setItem(
            "myGalleryImages",
            JSON.stringify(savedImages)
        );


        /* ADD TO GALLERY */

        allImages.push(newImage);

        currentImages = allImages;


        displayGallery(allImages);


        /* RESET FORM */

        imageForm.reset();


        /* CLOSE MODAL */

        addModal.style.display = "none";


        alert("✅ Image added successfully!");

    };


    reader.readAsDataURL(file);

});


/* KEYBOARD CONTROLS */

document.addEventListener("keydown", function(event) {

    if (lightbox.style.display === "flex") {

        if (event.key === "ArrowRight") {
            nextBtn.click();
        }

        if (event.key === "ArrowLeft") {
            prevBtn.click();
        }

        if (event.key === "Escape") {
            lightbox.style.display = "none";
        }

    }

});