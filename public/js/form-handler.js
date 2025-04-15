document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - checking for elements");
    const form = document.getElementById('registration-form');

    // Check if the modal exists, and if not, create it
    let modal = document.getElementById('success-modal');
    if (!modal) {
        console.log("Modal not found - creating modal element");
        modal = document.createElement('div');
        modal.id = 'success-modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modal.appendChild(modalContent);

        // Append to body
        document.body.appendChild(modal);
    } else {
        console.log("Modal found in document");
    }

    // Now we're sure the modal exists
    const modalContent = modal.querySelector('.modal-content');

    if (form) {
        console.log("Form found - adding submit event listener");
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Form submitted");

            // Show modal with loading spinner immediately
            const loadingHTML = `
                <div class="modal-spinner">
                    <div class="spinner"></div>
                    <p>Traitement en cours...</p>
                </div>
            `;

            modalContent.innerHTML = loadingHTML;
            modal.style.display = 'flex';

            // Get form data
            const formData = new FormData(form);
            const formObject = {};

            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            console.log("Sending form data:", Object.keys(formObject));

            // Send AJAX request
            fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObject)
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Response received:", data);
                    if (data.success) {
                        // Update modal with success message
                        modalContent.innerHTML = `
                        <div class="success-icon">✔</div>
                        <h3>Succès !</h3>
                        <p>Votre inscription a bien été envoyée.</p>
                        <p>Un email de confirmation vous a été envoyé à l'adresse indiquée.</p>
                        <button class="close-modal">Fermer</button>
                    `;

                        // Reset form
                        form.reset();
                    } else {
                        // Update modal with error message
                        modalContent.innerHTML = `
                        <div class="error-icon">❌</div>
                        <h3>Erreur</h3>
                        <p>${data.message || "Une erreur est survenue lors de l'envoi de votre inscription."}</p>
                        <p>Veuillez réessayer ultérieurement.</p>
                        <button class="close-modal">Fermer</button>
                    `;
                    }

                    // Re-bind close button event
                    addCloseModalListeners(modal);
                })
                .catch(error => {
                    console.error('Error:', error);

                    // Update modal with error message
                    modalContent.innerHTML = `
                    <div class="error-icon">❌</div>
                    <h3>Erreur</h3>
                    <p>Une erreur est survenue lors de l'envoi de votre inscription.</p>
                    <p>Veuillez réessayer ultérieurement.</p>
                    <button class="close-modal">Fermer</button>
                `;

                    // Re-bind close button event
                    addCloseModalListeners(modal);
                });
        });
    } else {
        console.error("Registration form not found on page");
    }

    // Function to add close modal listeners
    function addCloseModalListeners(modalElement) {
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                modalElement.style.display = 'none';
            });
        });

        // Close modal when clicking outside of it
        window.addEventListener('click', function(e) {
            if (e.target === modalElement) {
                modalElement.style.display = 'none';
            }
        });
    }

    // Add initial close listeners
    addCloseModalListeners(modal);
});