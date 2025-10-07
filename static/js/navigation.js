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
        // Only toggle on mobile
        if (window.innerWidth <= 900) {
            hamburgerBtn.classList.toggle("active");
            sidebar.classList.toggle("active");
            mobileOverlay.classList.toggle("active");
        }
    }

    hamburgerBtn.addEventListener("click", toggleSidebar);
    mobileOverlay.addEventListener("click", toggleSidebar);

    // Close sidebar when clicking a nav button (on mobile only)
    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (window.innerWidth <= 900) {
                hamburgerBtn.classList.remove("active");
                sidebar.classList.remove("active");
                mobileOverlay.classList.remove("active");
            }
        });
    });

    // Clean up on resize
    window.addEventListener("resize", function() {
        if (window.innerWidth > 900) {
            hamburgerBtn.classList.remove("active");
            sidebar.classList.remove("active");
            mobileOverlay.classList.remove("active");
        }
    });
});
