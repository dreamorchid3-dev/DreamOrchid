const index = localStorage.getItem("selectedOrchid");
let orchids = JSON.parse(localStorage.getItem("orchids")) || [];
let item = orchids[index];

// IMAGES
document.getElementById("mainImage").src = item.profileImage;
document.getElementById("img1").src = item.image1;
document.getElementById("img2").src = item.image2;

// SWITCH BIG IMAGE ON CLICK
document.getElementById("img1").onclick = () => {
  document.getElementById("mainImage").src = item.image1;
};

document.getElementById("img2").onclick = () => {
  document.getElementById("mainImage").src = item.image2;
};

// TEXT INFO
document.getElementById("name").innerText = item.name;
document.getElementById("growth").innerText = item.growth;
document.getElementById("category").innerText = item.category;
document.getElementById("desc").innerText = item.desc;
document.getElementById("price").innerText = "₹ " + item.price;

// BOOK BUTTON
const bookBtn = document.getElementById("bookBtn");

if (item.availability === "Out of Stock") {
  bookBtn.disabled = true;
}
