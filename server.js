const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Configure EJS as the templating engine
app.set('view engine', 'ejs');
app.use(express.json()); 
app.set('views', path.join(__dirname, 'views'));

// Create a directory for storing downloaded images
const IMAGES_DIR = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to download and save image
async function downloadImage(imageUrl) {
    try {
        const filename = crypto.createHash('md5').update(imageUrl).digest('hex') + '.jpg';
        const filepath = path.join(IMAGES_DIR, filename);

        if (fs.existsSync(filepath)) {
            return `/images/${filename}`;
        }

        const response = await axios({
            method: 'GET',
            url: imageUrl,
            responseType: 'stream',
            timeout: 5000,
        });

        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(`/images/${filename}`));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading image from ${imageUrl}:`, error.message);
        return null;
    }
}

app.get('/events', async (req, res) => {
    try {
        const postsFilePath = path.join(__dirname, 'instagram_posts.json');
        const postsData = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));

        const downloadPromises = postsData.map(async (post) => {
            const localImagePath = await downloadImage(post.image_url);
            return {
                ...post,
                local_image_url: localImagePath || '/images/placeholder.jpg',
            };
        });

        const postsWithLocalImages = await Promise.all(downloadPromises);

        res.render('index', { posts: postsWithLocalImages });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.use(bodyParser.urlencoded({ extended: true }));
// app.get('/contactus', (req, res) => {
//     const filePath = path.join(__dirname, 'public', 'contactus.html');
//     res.sendFile(filePath);
// });
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.post('/send-email', async (req, res) => {
    const { Name ,Email, Message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.FROM_MAIL,
            pass: process.env.FROM_APP_PASS, // Replace with your app password
        },
    });

    const mailOptions = {
        from: Email,
        to: 'prabhatkrishnaphoton43@gmail.com',
        subject: `Contact Us Form Submission from ${Name} `,
        text: `Name: ${Name} \nEmail: ${Email}\n\nMessage:\n${Message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send('Email sent successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending email.');
    }
});

app.get('/team', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Ecell-Team-/index.html');
    res.sendFile(filePath);
});
app.get('/services', (req, res) => {
    const filePath = path.join(__dirname, 'public', '/Ecell-service//index.html');
    res.sendFile(filePath);
});
// app.get('/about', (req, res) => {
//     const filePath = path.join(__dirname, 'public', 'Ecell About Page//about.html');
//     res.sendFile(filePath);
// });

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all other routes with React's index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
