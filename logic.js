document.addEventListener("DOMContentLoaded", () => {
    // Auth tabs logic
    window.switchAuthTab = function(tab) {
        const loginForm = document.getElementById('form-login');
        const registerForm = document.getElementById('form-register');
        const loginTab = document.getElementById('tab-login');
        const registerTab = document.getElementById('tab-register');
        const subtitle = document.getElementById('auth-subtitle');

        if (tab === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            loginTab.classList.add('active-tab');
            registerTab.classList.remove('active-tab');
            subtitle.innerText = 'Sign in to your account';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            loginTab.classList.remove('active-tab');
            registerTab.classList.add('active-tab');
            subtitle.innerText = 'Register a new account';
        }
    };

    // Populate supplements
    const supplements = [
        "St. John's Wort", "Ginkgo Biloba", "Garlic", "Ginseng", "Turmeric",
        "Fish Oil", "Vitamin K", "Vitamin E", "Calcium", "Iron", "Magnesium",
        "Melatonin", "Ashwagandha", "Echinacea", "CoQ10", "Probiotics",
        "Glucosamine", "CBD", "Cannabis", "Grapefruit"
    ];

    const container = document.getElementById("supplementsList");
    if (container) {
        supplements.forEach(sup => {
            const chip = document.createElement("div");
            chip.className = "chip";
            chip.textContent = sup;
            chip.addEventListener("click", () => {
                chip.classList.toggle("selected");
            });
            container.appendChild(chip);
        });
    }

    // Smooth scroll for TOC
    document.querySelectorAll('.toc-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
