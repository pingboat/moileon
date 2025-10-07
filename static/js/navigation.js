document.addEventListener("DOMContentLoaded", function () {
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const sidebar = document.querySelector(".sidebar");
    const mobileOverlay = document.querySelector(".mobile-overlay");
    const navButtons = document.querySelectorAll(".nav-button");

    if (!hamburgerBtn || !sidebar || !mobileOverlay) return;

    hamburgerBtn.addEventListener("click", function() {
        sidebar.classList.toggle("active");
        mobileOverlay.classList.toggle("active");
        hamburgerBtn.classList.toggle("active");
    });

    mobileOverlay.addEventListener("click", function() {
        sidebar.classList.remove("active");
        mobileOverlay.classList.remove("active");
        hamburgerBtn.classList.remove("active");
    });

    navButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            sidebar.classList.remove("active");
            mobileOverlay.classList.remove("active");
            hamburgerBtn.classList.remove("active");
        });
    });
});
