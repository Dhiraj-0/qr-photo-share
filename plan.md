# Plan: Front/Back Camera Switching Implementation

## Information Gathered

### Current Implementation Analysis:
1. **camera.js**: Uses `getUserMedia` API with `facingMode: { ideal: 'environment' }` which only requests the back camera
2. **index.html**: Contains the video element, capture/retake/upload buttons, and mode selector (camera/gallery)
3. **style.css**: Contains all styling for the interface

### Current Flow:
1. Page loads → `initCamera()` is called → requests back camera only
2. User clicks "Capture" → image captured to canvas → preview shown
3. User clicks "Upload" → `uploadImage()` sends to server → QR code generated
4. Result displayed with QR code

## Plan

### Step 1: Update `camera.js`
- Add `currentFacingMode` variable to track current camera ('environment' or 'user')
- Add `switchCamera()` function to toggle between front/back cameras
- Modify `initCamera()` to accept optional `facingMode` parameter
- Add button element reference for camera switch
- Add event listener for switch camera button

### Step 2: Update `index.html`
- Add a switch camera button (🔄) in the camera controls area
- Position it next to the capture button

### Step 3: Update `style.css`
- Add styling for the switch camera button
- Make it visually consistent with existing buttons

## Dependent Files to be Edited
1. `static/js/camera.js` - Main logic changes
2. `templates/index.html` - Add switch button
3. `static/css/style.css` - Add button styling

## Followup Steps
1. Test the implementation on a device with both front and back cameras
2. Verify camera switching works correctly
3. Ensure QR code generation still works after capturing from either camera

