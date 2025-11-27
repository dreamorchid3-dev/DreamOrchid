// render.js — Firebase-integrated version
import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const shopContainer = document.querySelector(".item-cards");
  const searchInput = document.querySelector(".search-box");
  const categoryFilter = document.getElementById("categoryFilter");
  const growthFilter = document.getElementById("growthFilter");

  if (!shopContainer) {
    console.error("render.js: .item-cards container not found.");
    return;
  }

  let orchids = []; // global in this file so filters can reuse it

  async function loadShopCards(filterName = "", filterCategory = "All", filterGrowth = "All") {
    shopContainer.innerHTML = "";

    const filtered = orchids.filter(item => {
      const name = String(item.name || "").toLowerCase();
      const category = String(item.category || "");
      const growth = String(item.growth || "");

      const nameMatches = name.includes(String(filterName).toLowerCase());
      const categoryMatches = (filterCategory === "All" || category === filterCategory);
      const growthMatches = (filterGrowth === "All" || growth === filterGrowth);

      return nameMatches && categoryMatches && growthMatches;
    });

    if (filtered.length === 0) {
      shopContainer.innerHTML = `<p class="no-items">No orchids found. Check back later.</p>`;
      return;
    }

    filtered.forEach((item) => {
      const name = item.name || "Unnamed";
      const desc = item.desc || "";
      const growth = item.growth || "Unknown";
      const price = item.price || "0";
      const profileImage = item.profileImage || "assets/placeholder.png";
      const availability = item.availability || "Out of Stock";

      const statusClass = availability === "Available" ? "green" : "red";
      const disabledBtn = availability === "Out of Stock" ? "disabled" : "";

      shopContainer.innerHTML += `
        <div onclick="openDetails('${item.id}')" class="card-container">
          <div class="card-image">
            <img src="${profileImage}" alt="${name}">
            <div class="status-tag ${statusClass}">${availability}</div>
          </div>
          <div class="card-content">
            <h2>${escapeHtml(name)}</h2>
            <p class="desc">${escapeHtml(desc)}</p>
            <p><b>Stage :</b> ${escapeHtml(growth)}</p>
          </div>
          <div class="card-footer">
            <span class="price">₹${escapeHtml(price)}</span>
            <button class="book-btn" ${disabledBtn}>Details</button>
          </div>
        </div>
      `;
    });
  }

  // Fetch once from Firestore, then filters work instantly
  async function fetchFromFirestore() {
    const querySnapshot = await getDocs(collection(db, "orchids"));
    
    orchids = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    loadShopCards(); // initial render
  }

  // Safe HTML
  function escapeHtml(str) {
    if (typeof str !== "string") return str;
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Search & Filters
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      loadShopCards(searchInput.value, categoryFilter?.value || "All", growthFilter?.value || "All");
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      loadShopCards(searchInput?.value || "", categoryFilter.value, growthFilter?.value || "All");
    });
  }

  if (growthFilter) {
    growthFilter.addEventListener("change", () => {
      loadShopCards(searchInput?.value || "", categoryFilter?.value || "All", growthFilter.value);
    });
  }

  // Expose for HTML
  window.openDetails = function(id) {
    localStorage.setItem("selectedOrchid", id);
    window.location.href = "details.html";
  };

  // Start Firestore fetch
  fetchFromFirestore();
});
