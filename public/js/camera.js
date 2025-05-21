// @Rayen Ben Moussa
// used AI to generate this code responsible for adding a camera feature

lucide.createIcons();
const startCameraBtn = document.getElementById('start-camera');
const cameraContainer = document.getElementById('camera-container');
const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');
const closeCameraBtn = document.getElementById('close-camera');

const canvas = document.getElementById('canvas');
const closeCanvasBtn = document.getElementById('close-canvas');

// Start camera
startCameraBtn.addEventListener('click', async () => {
  cameraContainer.classList.remove('hidden');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error('Camera error:', err);
  }
});

// Capture image
captureBtn.addEventListener('click', () => {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.classList.remove('hidden');
  closeCanvasBtn.classList.remove('hidden');
});

// Close camera container
function closeCamera() {
  closeCameraBtn.addEventListener('click', () => {
    cameraContainer.classList.add('hidden');
    const stream = video.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  });
}
closeCamera();
// Close canvas
closeCanvasBtn.addEventListener('click', () => {
  canvas.classList.add('hidden');
  closeCanvasBtn.classList.add('hidden');
  cameraContainer.classList.add('hidden');
});
