# QR Photo Share

A full-stack web application that allows users to capture photos directly from their mobile browser, generates unique URLs, and creates QR codes for instant sharing.

## Features

- 📸 **Camera Capture** - Use your device's camera to take photos directly in the browser
- 🔗 **Unique URLs** - Each photo gets a unique, private URL
- 📱 **QR Code Generation** - Automatic QR code creation for easy scanning
- 🔒 **Privacy Protected** - Images stored with random UUID filenames, not publicly accessible
- 📱 **Mobile Friendly** - Responsive design optimized for smartphones
- ⚡ **Fast & Simple** - No account required, instant sharing

## Tech Stack

- **Backend**: Python Flask
- **Frontend**: HTML, CSS, JavaScript
- **Camera**: WebRTC getUserMedia() API
- **QR Generation**: Python qrcode library

## Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   
```
bash
   cd "QR py"
   
```

3. Create a virtual environment (recommended):
   
```
bash
   python -m venv venv
   
```

4. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

5. Install dependencies:
   
```
bash
   pip install -r requirements.txt
   
```

### Running Locally

1. Start the Flask server:
   
```
bash
   python app.py
   
```

2. Open your browser and visit:
   
```
   http://localhost:5000
   
```

3. Grant camera permissions when prompted

4. Capture a photo and click "Upload"

5. Scan the QR code with your phone or visit the generated link

## Project Structure

```
QR py/
├── app.py                 # Main Flask application
├── requirements.txt      # Python dependencies
├── README.md            # This file
├── DEPLOYMENT.md        # Deployment instructions
├── static/
│   ├── css/
│   │   └── style.css    # Mobile-friendly styles
│   └── js/
│       └── camera.js   # Camera capture logic
└── templates/
    ├── index.html      # Main capture page
    └── view.html      # Image viewing page
```

## Usage

### Capturing Photos

1. Visit the website on a device with a camera
2. Grant camera permission when prompted
3. Position your shot and click "Capture"
4. Review the photo and click "Retake" if needed
5. Click "Upload" to generate your QR code

### Sharing

- **Scan QR Code**: Use any QR scanner app to scan and view on another device
- **Share Link**: Copy the unique URL and share via messaging apps
- **Download**: Click "View Full Size" to download the image

### Privacy

- Images are stored with random UUID filenames (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg`)
- Images can only be accessed via their unique URLs
- No directory listing or public browsing allowed
- No images are stored permanently in a real deployment (temp storage)

## Deployment

### Deploy on Render

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

Quick steps for Render:
1. Push your code to GitHub
2. Create a Web Service on Render
3. Connect your GitHub repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `python app.py`

### Deploy on Railway

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

Quick steps for Railway:
1. Push your code to GitHub
2. Create a new project on Railway
3. Connect your GitHub repository
4. Deploy automatically

## Troubleshooting

### Camera Not Working

- **Permission Denied**: Make sure to grant camera permission in browser settings
- **No Camera Found**: Ensure your device has a camera and it's not in use by another app
- **HTTPS Required**: Some browsers require HTTPS for camera access (deployed sites)

### Upload Fails

- Check that the `static/uploads` folder has write permissions
- Ensure file size is under 16MB
- Check console for error messages

### QR Code Not Scanning

- Ensure good lighting on the QR code
- Clean your phone's camera lens
- Try copying the URL directly instead

## License

MIT License - Feel free to use and modify as needed.

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.
