// render.js — robust version
document.addEventListener("DOMContentLoaded", () => {
  const shopContainer = document.querySelector(".item-cards");
  const searchInput = document.querySelector(".search-box");
  const categoryFilter = document.getElementById("categoryFilter");
  const growthFilter = document.getElementById("growthFilter");

  // defensive checks
  if (!shopContainer) {
    console.error("render.js: .item-cards container not found in DOM.");
    return;
  }
  if (!searchInput) console.warn("render.js: .search-box not found — search will be disabled.");
  if (!categoryFilter) console.warn("render.js: #categoryFilter not found — category filter disabled.");
  if (!growthFilter) console.warn("render.js: #growthFilter not found — growth filter disabled.");

  function loadShopCards(filterName = "", filterCategory = "All", filterGrowth = "All") {
    let orchids = JSON.parse(localStorage.getItem("orchids")) || [];
    shopContainer.innerHTML = "";

    // if no orchids, show friendly message
    if (!Array.isArray(orchids) || orchids.length === 0) {
      shopContainer.innerHTML = `<p class="no-items">No orchids found. Check back later.</p>`;
      return;
    }

    orchids
      .filter(item => {
        // make safe-access helpers
        const name = (item && item.name) ? String(item.name) : "";
        const category = (item && item.category) ? String(item.category) : "";
        const growth = (item && item.growth) ? String(item.growth) : "";

        const nameMatches = name.toLowerCase().includes(String(filterName || "").toLowerCase());
        const categoryMatches = (filterCategory === "All" || category === filterCategory);
        const growthMatches = (filterGrowth === "All" || growth === filterGrowth);

        return nameMatches && categoryMatches && growthMatches;
      })
      .forEach((item, index) => {
        // safe item fields with fallbacks
        const name = item && item.name ? item.name : "Unnamed";
        const desc = item && item.desc ? item.desc : "";
        const growth = item && item.growth ? item.growth : "Unknown";
        const price = item && item.price ? item.price : "0";
        const profileImage = item && item.profileImage ? item.profileImage : "assets/placeholder.png";
        const availability = item && item.availability ? item.availability : "Out of Stock";

        const statusClass = availability === "Available" ? "green" : "red";
        const disabledBtn = availability === "Out of Stock" ? "disabled" : "";

        shopContainer.innerHTML += `
          <div onclick="openDetails(${index})" class="card-container">
            <div class="card-image">
              <img src="${profileImage}" alt="${name}">
              <div class="status-tag ${statusClass}">${availability}</div>
            </div>
            <div class="card-content">
              <h2>${escapeHtml(name)}</h2>
              <p class="desc">${escapeHtml(desc)}</p>
              <p><b>Growth:</b> ${escapeHtml(growth)}</p>
            </div>
            <div class="card-footer">
              <span class="price">₹${escapeHtml(price)}</span>
              <button class="book-btn" ${disabledBtn}>Details</button>
            </div>
          </div>
        `;
      });
  }

  // small helper to avoid HTML injection when inserting values
  function escapeHtml(str) {
    if (typeof str !== "string") return str;
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Safe wiring of input events (only if elements exist)
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

  // initial render
  loadShopCards();

  // expose openDetails to global scope (so onclick in HTML can call it)
  window.openDetails = function(index) {
    localStorage.setItem("selectedOrchid", index);
    window.location.href = "details.html";
  };
});
