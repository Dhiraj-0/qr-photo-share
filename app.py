"""
QR Photo Share - Flask Application
A web app that captures photos from browser, generates unique URLs and QR codes.
"""

import os
import uuid
import qrcode
import io
import base64
from flask import Flask, render_template, request, send_from_directory, jsonify, redirect, url_for

# Initialize Flask app
app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = os.path.join('static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH


def generate_unique_filename():
    """
    Generate a unique filename using UUID4 for privacy protection.
    Returns a string with UUID followed by .jpg extension.
    """
    return f"{uuid.uuid4()}.jpg"


def allowed_file(filename):
    """
    Check if the file extension is allowed.
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_qr_code(data):
    """
    Generate a QR code from the given data.
    Returns the QR code image as base64 string.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save to bytes buffer
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    
    # Return as base64
    return base64.b64encode(buffer.getvalue()).decode()


@app.route('/')
def index():
    """
    Main page - displays camera interface for capturing photos.
    """
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_image():
    """
    Handle image upload from the camera.
    Receives base64 encoded image, saves it, generates unique URL and QR code.
    """
    try:
        # Get the image data from request
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Extract base64 image data
        image_data = data['image']
        
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64 image
        try:
            image_bytes = base64.b64decode(image_data)
        except Exception as e:
            return jsonify({'error': 'Invalid image data'}), 400
        
        # Generate unique filename for privacy
        filename = generate_unique_filename()
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the image
        with open(filepath, 'wb') as f:
            f.write(image_bytes)
        
        # Generate unique URL for the image - use explicit domain for production
        base_url = os.environ.get('APP_URL', request.host_url.rstrip('/'))
        unique_url = f"{base_url}/img/{filename}"
        
        # Generate QR code
        qr_code_b64 = generate_qr_code(unique_url)
        
        return jsonify({
            'success': True,
            'image_url': unique_url,
            'qr_code': qr_code_b64,
            'filename': filename
        })
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


@app.route('/upload-file', methods=['POST'])
def upload_file():
    """
    Handle file upload from device gallery.
    Accepts image files uploaded directly.
    """
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: png, jpg, jpeg, gif'}), 400
        
        # Generate unique filename for privacy
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4()}.{ext}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the image
        file.save(filepath)
        
        # Generate unique URL - use explicit domain for production
        base_url = os.environ.get('APP_URL', request.host_url.rstrip('/'))
        unique_url = f"{base_url}/img/{filename}"
        
        # Generate QR code
        qr_code_b64 = generate_qr_code(unique_url)
        
        return jsonify({
            'success': True,
            'image_url': unique_url,
            'qr_code': qr_code_b64,
            'filename': filename
        })
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


@app.route('/img/<filename>')
def serve_image(filename):
    """
    Serve the uploaded image.
    This endpoint is protected - images are only accessible via unique URL.
    """
    # Security check: ensure filename is valid UUID format
    # This prevents directory traversal attacks
    filename_parts = filename.split('.')
    if len(filename_parts) != 2:
        return jsonify({'error': 'Invalid filename'}), 404
    
    uuid_part = filename_parts[0]
    try:
        uuid.UUID(uuid_part)  # Validate UUID format
    except ValueError:
        return jsonify({'error': 'Invalid image identifier'}), 404
    
    # Check if file exists
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'Image not found'}), 404
    
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/qr/<filename>')
def show_qr(filename):
    """
    Display page with QR code for easy sharing.
    """
    # Validate filename
    filename_parts = filename.split('.')
    if len(filename_parts) != 2:
        return jsonify({'error': 'Invalid filename'}), 404
    
    uuid_part = filename_parts[0]
    try:
        uuid.UUID(uuid_part)
    except ValueError:
        return jsonify({'error': 'Invalid image identifier'}), 404
    
    # Generate the image URL - use explicit domain for production
    base_url = os.environ.get('APP_URL', request.host_url.rstrip('/'))
    image_url = f"{base_url}/img/{filename}"
    
    # Generate QR code
    qr_code_b64 = generate_qr_code(image_url)
    
    return render_template('view.html', 
                           image_url=image_url, 
                           qr_code=qr_code_b64,
                           filename=filename)


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Page not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Run the application
    print("=" * 50)
    print("QR Photo Share - Starting Server")
    print("=" * 50)
    print("Visit: http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)
