/* ==================================================
   NAVIGATION & MOBILE SIDEBAR
   ================================================== */

// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", function () {
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const sidebar = document.querySelector(".sidebar");
    const mobileOverlay = document.querySelector(".mobile-overlay");
    const navButtons = document.querySelectorAll(".nav-button");

    if (!hamburgerBtn || !sidebar || !mobileOverlay) return;

    // Toggle sidebar + overlay
    function toggleSidebar() {
        hamburgerBtn.classList.toggle("active");
        sidebar.classList.toggle("active");
        mobileOverlay.classList.toggle("active");
    }

    hamburgerBtn.addEventListener("click", toggleSidebar);
    mobileOverlay.addEventListener("click", toggleSidebar);

    // Close sidebar when clicking a nav button (on mobile)
    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (window.innerWidth <= 900) {
                toggleSidebar();
            }
        });
    });
});
