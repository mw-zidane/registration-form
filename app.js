const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON parsing for AJAX requests
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Home route
app.get('/', (req, res) => res.render('form'));

// Handle form submission
app.post('/submit', async (req, res) => {
    const form = req.body;

    // Email content for admin notification
    const adminEmailContent = `
    <h3>Nouvelle inscription reçue :</h3>
    <h4>Entreprise</h4>
    <ul>
        <li><strong>Nom:</strong> ${form.entreprise_nom}</li>
        <li><strong>Adresse:</strong> ${form.entreprise_adresse}</li>
        <li><strong>Code Postal:</strong> ${form.code_postal}</li>
        <li><strong>Ville:</strong> ${form.ville}</li>
        <li><strong>Pays:</strong> ${form.pays}</li>
        <li><strong>Téléphone:</strong> ${form.tel}</li>
        <li><strong>Site:</strong> ${form.site}</li>
        <li><strong>Fax:</strong> ${form.fax}</li>
    </ul>
    <h4>Participant</h4>
    <ul>
        <li><strong>Nom:</strong> ${form.nom_prenom}</li>
        <li><strong>Fonction:</strong> ${form.fonction}</li>
        <li><strong>Années d'expérience:</strong> ${form.experience}</li>
        <li><strong>Email:</strong> ${form.email}</li>
    </ul>
    <h4>Pack</h4>
    <p><strong>Pack :</strong> ${form.pack}</p>
    <h4>Informations supplémentaires</h4>
    <ul>
        <li><p><strong>Formation similaire :</strong> ${form.formation_similaire}</p></li>
        <li>${form.formation ? `<p><strong>Formation :</strong> ${form.formation}</p>` : ''}</li>
        <li><p><strong>Expérience en management de projet :</strong> ${form.experience_mp}</p></li>
        <li>${form.specialisation ? `<p><strong>Spécialisation :</strong> ${form.specialisation}</p>` : ''}</li>
        <li><p><strong>Conditions Spécifiques:</strong> ${form.conditions_specifiques}</p></li>
    </ul>
  `;

    // Email content for user confirmation
    const userEmailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a6ee0;">Confirmation d'Inscription - Formation PMP</h2>
        <p>Bonjour <strong>${form.nom_prenom}</strong>,</p>
        <p>Nous vous remercions pour votre inscription à notre formation PMP prévue en Mai 2025.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333;">Récapitulatif de votre inscription</h3>
            <p><strong>Nom :</strong> ${form.nom_prenom}</p>
            <p><strong>Email :</strong> ${form.email}</p>
            <p><strong>Entreprise :</strong> ${form.entreprise_nom}</p>
            <p><strong>Pack choisi :</strong> ${form.pack}</p>
        </div>
        
        <p>Notre équipe va examiner votre inscription et vous contactera prochainement pour la suite des démarches.</p>
        <p>Si vous avez des questions, n'hésitez pas à nous contacter par email.</p>
        
        <p style="margin-top: 30px;">Cordialement,</p>
        <p><strong>L'équipe SECEL</strong></p>
    </div>
    `;

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for port 465, false for 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    // Email options for admin notification
    const adminMailOptions = {
        from: `"Formulaire d'Inscription PMP" <${process.env.SMTP_USER}>`,
        to: 'secelgroup2025@gmail.com', // admin email
        subject: 'Nouvelle Inscription Formation PMP',
        html: adminEmailContent
    };

    // Email options for user confirmation
    const userMailOptions = {
        from: `"SECEL Formation" <zwanko@secelgroup.com>`,
        to: form.email, // user's email from the form
        subject: 'Confirmation de votre inscription à la Formation PMP',
        html: userEmailContent
    };

    try {
        // Send admin notification email
        await transporter.sendMail(adminMailOptions);

        // Send user confirmation email
        await transporter.sendMail(userMailOptions);

        // Send success response
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Email Error:', err);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'envoi du message."
        });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
