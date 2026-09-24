const screens = document.querySelectorAll(".screen");
const navItems = document.querySelectorAll(".nav-item");
const pageLinks = document.querySelectorAll("[data-page]");

function showPage(page) {
  const target = document.getElementById(page) || document.getElementById("home");
  screens.forEach(screen => screen.classList.toggle("active", screen === target));
  navItems.forEach(item => item.classList.toggle("active", item.dataset.page === target.id));
  history.replaceState(null, "", "#" + target.id);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

pageLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    showPage(link.dataset.page);
  });
});

const initialPage = location.hash.replace("#", "");
showPage(initialPage === "tools" ? "tools" : "home");
