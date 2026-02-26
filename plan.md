# QR Photo Share - Full Stack Application Plan

## Project Overview
A Flask-based web application that allows users to capture photos from their mobile browser, generates a unique URL for each image, creates a QR code for sharing, and ensures images are only accessible via their unique links.

## Folder Structure
```
QR py/
├── app.py                 # Main Flask application
├── requirements.txt      # Python dependencies
├── static/
│   ├── uploads/          # Stored images (created at runtime)
│   ├── css/
│   │   └── style.css     # Mobile-friendly styles
│   └── js/
│       └── camera.js     # Camera capture logic
├── templates/
│   ├── index.html        # Main capture page
│   └── view.html         # Image viewing page
├── README.md             # Documentation
└── DEPLOYMENT.md         # Deployment guide
```

## Technical Implementation

### Backend (app.py)
- Flask routes:
  - GET / - Main camera capture page
  - POST /upload - Handle image upload
  - GET /img/<unique_id> - Serve image (protected)
  - GET /qr/<unique_id> - QR code display page
- UUID4 for unique filenames
- QR code generation using qrcode library
- Static folder protection

### Frontend
- index.html: Camera interface with capture button
- style.css: Mobile-friendly responsive design
- camera.js: getUserMedia() API integration

### Features
1. Camera access via getUserMedia()
2. Photo capture from browser
3. Base64 image upload to Flask
4. Secure UUID filename storage
5. Unique URL generation
6. QR code automatic generation
7. Image viewing via unique link
8. Privacy: No directory listing

## Files to Create
1. app.py - Flask backend
2. requirements.txt - Dependencies
3. static/css/style.css - Styles
4. static/js/camera.js - Camera logic
5. templates/index.html - Capture page
6. templates/view.html - View page
7. README.md - Documentation
8. DEPLOYMENT.md - Deployment guide
