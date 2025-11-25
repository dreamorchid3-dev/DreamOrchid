if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

const container = document.querySelector(".item-cards");
const formSection = document.getElementById("formSection");
const addBtn = document.getElementById("addNew");
const title = document.getElementById("formTitle");
const editIndex = document.getElementById("editIndex");

function loadCards() {   
  container.innerHTML = "";
  let orchids = JSON.parse(localStorage.getItem("orchids")) || [];

  orchids.forEach((item, index) => {
    container.innerHTML += `
      <div class="card-container">
        <div class="card-image">
          <img src="${item.profileImage}" alt="">
          <div class="status-tag ${item.availability === 'Available' ? 'green' : 'red'}">
            ${item.availability}
          </div>
        </div>
        <div class="card-content">
          <h2>${item.name}</h2>
          <p class="desc">${item.desc}</p>
          <p><b>Growth:</b> ${item.growth}</p>

          <div class="card-footer">
            <span class="price">$ ${item.price}</span>
            <button onclick="editItem(${index})" class="edit-btn">✏ Edit</button>
            <button onclick="deleteItem(${index})" class="delete-btn">🗑 Delete</button>
          </div>
        </div>
      </div>
    `;
  });
}
loadCards();


// Open Form
addBtn.addEventListener("click", () => {
  formSection.style.display = "block"; 
  title.innerText = "Add Orchid";
  editIndex.value = "";
  
});




// Save / Edit Orchid 
document.getElementById("formSection").addEventListener("submit", function (e) {
  e.preventDefault();

  let orchids = JSON.parse(localStorage.getItem("orchids")) || [];
  let index = editIndex.value;

  let files = {
    profileImage: document.getElementById("profileImage").files[0],
    image1: document.getElementById("image1").files[0],
    image2: document.getElementById("image2").files[0]
  };

  let imageResults = {};

  function readImage(key, file) {
    return new Promise((resolve) => {
      if (!file) {
        imageResults[key] = index ? orchids[index][key] : ""; // Keep old image if editing
        return resolve();
      }
      const reader = new FileReader();
      reader.onload = () => {
        imageResults[key] = reader.result;
        resolve();
      };
      reader.readAsDataURL(file);
    });
  }

  Promise.all([
    readImage("profileImage", files.profileImage),
    readImage("image1", files.image1),
    readImage("image2", files.image2)
  ]).then(() => {
    let newItem = {
      name: document.getElementById("name").value,
      desc: document.getElementById("desc").value,
      price: document.getElementById("price").value,
      category: document.getElementById("category").value,
      growth: document.getElementById("growth").value,
      availability: document.getElementById("availability").value,
      ...imageResults  //  Merge all images
    };

    if (index) orchids[index] = newItem;
    else orchids.push(newItem);

    localStorage.setItem("orchids", JSON.stringify(orchids));
    formSection.style.display = "none";
    loadCards();
    alert(index ? "Updated Successfully!" : "Orchid Added!");
  });
});

// Edit Orchid 
function editItem(i) {
  let orchids = JSON.parse(localStorage.getItem("orchids"));
  let item = orchids[i];

  formSection.style.display = "block";
  title.innerText = "Edit Orchid";
  editIndex.value = i;

  document.getElementById("name").value = item.name;
  document.getElementById("desc").value = item.desc;
  document.getElementById("price").value = item.price;
  document.getElementById("category").value = item.category;
  document.getElementById("growth").value = item.growth;
  document.getElementById("availability").value = item.availability;
}


function hideForm() {
  formSection.reset();
  formSection.style.display = "none";
  editIndex.value = "";
  const profilePreview = document.getElementById("profilePreview");
  if (profilePreview) profilePreview.src = "";

  const fileIds = ["profileImage", "image1", "image2"];
  fileIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}



// Delete Orchid 
function deleteItem(i) {
  let orchids = JSON.parse(localStorage.getItem("orchids"));
  orchids.splice(i, 1);
  localStorage.setItem("orchids", JSON.stringify(orchids));
  loadCards();
  alert("Item Deleted!");
}
