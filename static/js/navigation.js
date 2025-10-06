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

    // Force hide sidebar on mobile on initial load
    if (window.innerWidth <= 768) {
        sidebar.classList.remove("active");
        mobileOverlay.classList.remove("active");
        hamburgerBtn.classList.remove("active");
    }

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
            if (window.innerWidth <= 768) {
                sidebar.classList.remove("active");
                mobileOverlay.classList.remove("active");
                hamburgerBtn.classList.remove("active");
            }
        });
    });

    // Handle window resize
    window.addEventListener("resize", function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove("active");
            mobileOverlay.classList.remove("active");
            hamburgerBtn.classList.remove("active");
        }
    });
});
