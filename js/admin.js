import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
});

const container = document.querySelector(".item-cards");
const formSection = document.getElementById("formSection");
const addBtn = document.getElementById("addNew");
const title = document.getElementById("formTitle");
const editIndex = document.getElementById("editIndex");

import { db, storage } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

async function loadCards() {
  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "orchids"));
  snapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;

    container.innerHTML += `
      <div class="card-container">
        <div class="card-image">
          <img src="${data.profileImage}" alt="">
          <div class="status-tag ${
            data.availability === "Available" ? "green" : "red"
          }">
            ${data.availability}
          </div>
        </div>

        <div class="card-content">
          <h2>${data.name}</h2>
          <p class="desc">${data.desc}</p>
          <p><b>Stage:</b> ${data.growth}</p>

          <div class="card-footer">
            <span class="price">$ ${data.price}</span>
            <button onclick="editItem('${id}')" class="edit-btn">✏ Edit</button>
            <button onclick="deleteItem('${id}')" class="delete-btn">🗑 Delete</button>
          </div>
        </div>
      </div>
    `;
  });
}
loadCards();

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

async function saveOrchid(id = null) {
  // Read form data
  const name = document.getElementById("name").value;
  const desc = document.getElementById("desc").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;
  const growth = document.getElementById("growth").value;
  const availability = document.getElementById("availability").value;

  // Read image files
  const profileImageFile = document.getElementById("profileImage").files[0];
  const image1File = document.getElementById("image1").files[0];
  const image2File = document.getElementById("image2").files[0];

  let image1URL, image2URL, image3URL;

  let profileImageURL;

  // Upload image if new file selected
   async function uploadFile(file) {
    const fileRef = ref(storage, `orchids/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  }

  if (profileImageFile) profileImageURL = await uploadFile(profileImageFile);
  if (image1File) image1URL = await uploadFile(image1File);
  if (image2File) image2URL = await uploadFile(image2File);



  // Prepare data
  const data = {
    name,
    desc,
    price,
    category,
    growth,
    availability,
  };

  if (profileImageURL) data.profileImage = profileImageURL;
  if (image1URL) data.image1 = image1URL;
  if (image2URL) data.image2 = image2URL;

  // If editing (id exists)
  const docRef = id ? doc(db, "orchids", id) : doc(collection(db, "orchids"));

  await setDoc(docRef, data, { merge: true });

  formSection.style.display = "none";
  loadCards();
  alert(id ? "Updated!" : "Added!");

}

// Open Form
addBtn.addEventListener("click", () => {
  formSection.style.display = "block";
  title.innerText = "Add Orchid";
  editIndex.value = "";
});

// Edit Orchid

async function editItem(id) {
  const snap = await getDoc(doc(db, "orchids", id));
  const item = snap.data();

  editIndex.value = id;

  formSection.style.display = "block";
  title.innerText = "Edit Orchid";

  document.getElementById("name").value = item.name;
  document.getElementById("desc").value = item.desc;
  document.getElementById("price").value = item.price;
  document.getElementById("category").value = item.category;
  document.getElementById("growth").value = item.growth;
  document.getElementById("availability").value = item.availability;

 ["profileImage", "image1", "image2", "image3"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

function hideForm() {
  formSection.reset();
  formSection.style.display = "none";
  editIndex.value = "";
  const profilePreview = document.getElementById("profilePreview");
  ["image1", "image2", "image3"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  if (profilePreview) profilePreview.src = "";

  const fileIds = ["profileImage"];
  fileIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

// Delete Orchid

async function deleteItem(id) {
  await deleteDoc(doc(db, "orchids", id));
  loadCards();
  alert("Deleted!");
}


document.getElementById("saveBtn").addEventListener("click", () => {
  const id = editIndex.value || null;
  saveOrchid(id);
});
