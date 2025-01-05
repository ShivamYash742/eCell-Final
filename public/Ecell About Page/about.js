document.addEventListener('DOMContentLoaded', function () {
    // Select all elements with the 'fade-in' class
    const fadeElements = document.querySelectorAll('.fade-in');

    // Create an intersection observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the class 'fade-in-visible' to the element when it is in view
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target); // Stop observing once the element is visible
            }
        });
    }, {
        threshold: 0.2 // The element needs to be 20% visible before triggering the fade-in
    });

    // Observe each fade-in element
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});
