/**
 * QR Photo Share - Camera Capture Logic
 * Uses getUserMedia() API for camera access and capture
 */

// Global variables
let stream = null;
let capturedImage = null;
let selectedFile = null;
let currentImageUrl = null;
let currentQrCode = null;

// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const cameraContainer = document.querySelector('.camera-container');
const captureBtn = document.getElementById('captureBtn');
const retakeBtn = document.getElementById('retakeBtn');
const uploadBtn = document.getElementById('uploadBtn');
const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');
const qrCodeImg = document.getElementById('qrCodeImg');
const imageUrlLink = document.getElementById('imageUrl');

// Mode switching elements
const cameraModeBtn = document.getElementById('cameraModeBtn');
const uploadModeBtn = document.getElementById('uploadModeBtn');
const cameraMode = document.getElementById('cameraMode');
const uploadMode = document.getElementById('uploadMode');
const fileInput = document.getElementById('fileInput');
const uploadFileBtn = document.getElementById('uploadFileBtn');
const filePreview = document.getElementById('filePreview');

/**
 * Initialize camera when page loads
 */
document.addEventListener('DOMContentLoaded', initCamera);

/**
 * Initialize the camera
 */
async function initCamera() {
    showStatus('Requesting camera access...', 'info');
    
    try {
        // Request camera access - prefer back camera on mobile
        const constraints = {
            video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };
        
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Set video source to camera stream
        video.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve();
            };
        });
        
        showStatus('Camera ready! Position your shot and click capture.', 'success');
        captureBtn.disabled = false;
        
    } catch (err) {
        console.error('Camera error:', err);
        let errorMessage = 'Unable to access camera. ';
        
        if (err.name === 'NotAllowedError') {
            errorMessage += 'Please grant camera permission and refresh the page.';
        } else if (err.name === 'NotFoundError') {
            errorMessage += 'No camera found on this device.';
        } else if (err.name === 'NotReadableError') {
            errorMessage += 'Camera is in use by another application.';
        } else {
            errorMessage += 'Please check your camera settings.';
        }
        
        showStatus(errorMessage, 'error');
    }
}

/**
 * Capture photo from video stream
 */
function capturePhoto() {
    try {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get captured image as data URL
        capturedImage = canvas.toDataURL('image/jpeg', 0.9);
        
        // Show preview
        preview.src = capturedImage;
        cameraContainer.classList.add('captured');
        
        // Update buttons
        captureBtn.style.display = 'none';
        retakeBtn.style.display = 'inline-block';
        uploadBtn.style.display = 'inline-block';
        
        showStatus('Photo captured! Click "Upload" to generate QR code.', 'success');
        
        // Stop camera stream to save battery
        stopCameraStream();
        
    } catch (err) {
        console.error('Capture error:', err);
        showStatus('Error capturing photo. Please try again.', 'error');
    }
}

/**
 * Retake photo - reset to camera view
 */
function retakePhoto() {
    // Clear captured image
    capturedImage = null;
    
    // Show video again
    cameraContainer.classList.remove('captured');
    
    // Reset buttons
    captureBtn.style.display = 'inline-block';
    retakeBtn.style.display = 'none';
    uploadBtn.style.display = 'none';
    
    // Hide result
    resultDiv.classList.remove('show');
    
    // Restart camera
    initCamera();
    
    showStatus('Camera ready! Position your shot and click capture.', 'info');
}

/**
 * Upload captured image to server
 */
async function uploadImage() {
    if (!capturedImage) {
        showStatus('No image to upload. Please capture a photo first.', 'error');
        return;
    }
    
    // Show loading state
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';
    showStatus('Uploading image...', 'info');
    
    try {
        // Send image to server
        const response = await fetch('/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: capturedImage
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }
        
        // Store for sharing
        currentImageUrl = data.image_url;
        currentQrCode = data.qr_code;
        
        // Display result
        displayResult(data);
        
    } catch (err) {
        console.error('Upload error:', err);
        showStatus('Error uploading image: ' + err.message, 'error');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload';
    }
}

/**
 * Display the upload result with QR code
 */
function displayResult(data) {
    // Set QR code image
    qrCodeImg.src = 'data:image/png;base64,' + data.qr_code;
    
    // Set URL link
    imageUrlLink.href = data.image_url;
    imageUrlLink.textContent = data.image_url;
    
    // Update view link
    const viewLink = document.getElementById('viewLink');
    if (viewLink) {
        viewLink.href = '/qr/' + data.filename;
    }
    
    // Show result section
    resultDiv.classList.add('show');
    
    showStatus('Image uploaded successfully! Scan the QR code or visit the link.', 'success');
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Stop camera stream
 */
function stopCameraStream() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

/**
 * Show status message
 */
function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    statusDiv.style.display = 'block';
}

/**
 * Copy URL to clipboard
 */
function copyUrl() {
    const url = imageUrlLink.href;
    navigator.clipboard.writeText(url).then(() => {
        showStatus('URL copied to clipboard!', 'success');
    }).catch(err => {
        showStatus('Failed to copy URL', 'error');
    });
}

/**
 * Share using Web Share API (mobile-friendly)
 */
async function shareContent() {
    if (!currentImageUrl) {
        showStatus('No image to share. Please upload first.', 'error');
        return;
    }
    
    // Check if Web Share API is available
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Check out this photo!',
                text: 'View this photo I just captured:',
                url: currentImageUrl
            });
            showStatus('Shared successfully!', 'success');
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Share error:', err);
                showStatus('Share failed. Try copying the link instead.', 'error');
            }
        }
    } else {
        showStatus('Sharing not supported. Copy the link instead!', 'error');
    }
}

/**
 * Download QR code as image
 */
function downloadQrCode() {
    if (!currentQrCode) {
        showStatus('No QR code to download. Please upload first.', 'error');
        return;
    }
    
    const link = document.createElement('a');
    link.href = 'data:image/png;base64,' + currentQrCode;
    link.download = 'qr-code.png';
    link.click();
    showStatus('QR code downloaded!', 'success');
}

// Event listeners
if (captureBtn) {
    captureBtn.addEventListener('click', capturePhoto);
}
if (retakeBtn) {
    retakeBtn.addEventListener('click', retakePhoto);
}
if (uploadBtn) {
    uploadBtn.addEventListener('click', uploadImage);
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    stopCameraStream();
});

/**
 * Mode Switching Functions
 */
function switchToCameraMode() {
    cameraModeBtn.classList.add('active');
    uploadModeBtn.classList.remove('active');
    cameraMode.style.display = 'block';
    uploadMode.style.display = 'none';
    
    // Stop any file upload
    selectedFile = null;
    filePreview.innerHTML = '';
    uploadFileBtn.disabled = true;
    
    // Restart camera
    initCamera();
}

function switchToUploadMode() {
    uploadModeBtn.classList.add('active');
    cameraModeBtn.classList.remove('active');
    uploadMode.style.display = 'block';
    cameraMode.style.display = 'none';
    
    // Stop camera
    stopCameraStream();
    
    // Hide camera preview
    cameraContainer.classList.remove('captured');
    showStatus('Select an image from your gallery to upload.', 'info');
}

// File selection handler
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        selectedFile = file;
        
        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            filePreview.innerHTML = '<img src="' + e.target.result + '" alt="Preview">';
        };
        reader.readAsDataURL(file);
        
        uploadFileBtn.disabled = false;
        showStatus('File selected! Click "Upload Image" to generate QR code.', 'success');
    }
}

// Upload file handler
async function uploadFile() {
    if (!selectedFile) {
        showStatus('No file selected. Please select a file first.', 'error');
        return;
    }
    
    uploadFileBtn.disabled = true;
    uploadFileBtn.textContent = 'Uploading...';
    showStatus('Uploading file...', 'info');
    
    try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await fetch('/upload-file', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }
        
        currentImageUrl = data.image_url;
        currentQrCode = data.qr_code;
        
        displayResult(data);
        
    } catch (err) {
        console.error('Upload error:', err);
        showStatus('Error uploading file: ' + err.message, 'error');
    } finally {
        uploadFileBtn.disabled = false;
        uploadFileBtn.textContent = 'Upload Image';
    }
}

// Add event listeners for mode switching
if (cameraModeBtn) {
    cameraModeBtn.addEventListener('click', switchToCameraMode);
}
if (uploadModeBtn) {
    uploadModeBtn.addEventListener('click', switchToUploadMode);
}
if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
}
if (uploadFileBtn) {
    uploadFileBtn.addEventListener('click', uploadFile);
}
