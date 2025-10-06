/* ==================================================
   NAVIGATION & MOBILE SIDEBAR
   ================================================== */

// Immediately hide sidebar on mobile BEFORE page renders
(function() {
    if (window.innerWidth <= 768) {
        document.documentElement.style.setProperty('--sidebar-left', '-100%');
    }
})();

// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", function () {
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const sidebar = document.querySelector(".sidebar");
    const mobileOverlay = document.querySelector(".mobile-overlay");
    const navButtons = document.querySelectorAll(".nav-button");

    if (!hamburgerBtn || !sidebar || !mobileOverlay) {
        console.error("Navigation elements not found");
        return;
    }

    // Force proper state on load
    function initializeMobileState() {
        if (window.innerWidth <= 768) {
            sidebar.style.position = 'fixed';
            sidebar.style.left = '-100%';
            sidebar.style.top = '0';
            sidebar.style.width = '250px';
            sidebar.style.height = '100vh';
            sidebar.style.zIndex = '1000';
            mobileOverlay.style.display = 'none';
        } else {
            // Desktop: reset to default
            sidebar.style.position = '';
            sidebar.style.left = '';
            sidebar.style.top = '';
            sidebar.style.width = '';
            sidebar.style.height = '';
            sidebar.style.zIndex = '';
        }
    }

    // Initialize on load
    initializeMobileState();

    // Toggle sidebar + overlay
    function toggleSidebar() {
        if (window.innerWidth <= 768) {
            const isActive = sidebar.classList.contains("active");
            
            if (isActive) {
                sidebar.style.left = '-100%';
                mobileOverlay.style.display = 'none';
                sidebar.classList.remove("active");
                mobileOverlay.classList.remove("active");
                hamburgerBtn.classList.remove("active");
            } else {
                sidebar.style.left = '0';
                mobileOverlay.style.display = 'block';
                sidebar.classList.add("active");
                mobileOverlay.classList.add("active");
                hamburgerBtn.classList.add("active");
            }
        }
    }

    hamburgerBtn.addEventListener("click", toggleSidebar);
    mobileOverlay.addEventListener("click", toggleSidebar);

    // Close sidebar when clicking a nav button (on mobile)
    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                sidebar.style.left = '-100%';
                mobileOverlay.style.display = 'none';
                sidebar.classList.remove("active");
                mobileOverlay.classList.remove("active");
                hamburgerBtn.classList.remove("active");
            }
        });
    });

    // Handle window resize
    window.addEventListener("resize", function() {
        initializeMobileState();
        if (window.innerWidth > 768) {
            sidebar.classList.remove("active");
            mobileOverlay.classList.remove("active");
            hamburgerBtn.classList.remove("active");
        }
    });
});
