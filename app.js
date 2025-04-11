const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Home route
app.get('/', (req, res) => res.render('form'));

// Handle form submission
app.post('/submit', async (req, res) => {
    const form = req.body;

    const output = `
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
        <li><strong>Années d’expérience:</strong> ${form.experience}</li>
        <li><strong>Email:</strong> ${form.email}</li>
    </ul>
    <h4>Informations supplémentaires</h4>
    <p><strong>Formation similaire :</strong> ${form.formation_similaire}</p>
    <p><strong>Expérience en management de projet :</strong> ${form.experience_mp}</p>
    ${form.specialisation ? `<p><strong>Spécialisation :</strong> ${form.specialisation}</p>` : ''}
  `;

    // Transporter using your SMTP
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for port 465, false for 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `${form.nom_prenom} <${form.email}>`, // user's email
        to: 'zcodez237@gmail.com', // your fixed email
        subject: 'Nouvelle Inscription – Formulaire',
        html: output
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('OK'); // So the modal will trigger on success
    } catch (err) {
        console.error('Erreur email:', err);
        res.status(500).send("Erreur lors de l'envoi du message.");
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
