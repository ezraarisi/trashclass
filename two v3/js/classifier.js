const URL = "https://teachablemachine.withgoogle.com/models/Ptq7uuBO9/";
let model, webcam, labelContainer, maxPredictions;
let isHoldingStill = false;
let holdingTimer = null;
let predictionHistory = [];

// Load the image model and setup the webcam
async function init() {
    try {
        // Add permission check at the start
        if (!await checkPermissions()) {
            throw new Error('Camera permissions denied');
        }
        
        // Show loading state
        const startButtons = document.querySelectorAll('.button');
        startButtons.forEach(btn => {
            if (btn.getAttribute('onclick') === 'init()') {
                btn.innerHTML = 'Loading...';
                btn.style.backgroundColor = '#ccc';
                btn.style.pointerEvents = 'none';
            }
        });

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // Load model first
        try {
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();
        } catch (error) {
            throw new Error('Failed to load the model. Please check if the model URL is still valid.');
        }

        // Setup webcam
        const flip = true;
        webcam = new tmImage.Webcam(200, 200, flip);
        
        // Setup webcam first
        await webcam.setup();
        
        // Now we can safely modify the canvas
        webcam.canvas.style.width = '640px';
        webcam.canvas.style.height = '480px';
        webcam.canvas.style.objectFit = 'contain';
        
        // Start playing
        await webcam.play();
        window.requestAnimationFrame(loop);

        // Clear existing content and append new elements
        const webcamContainer = document.getElementById("webcam-container");
        const labelContainer = document.getElementById("label-container");
        
        webcamContainer.innerHTML = '';
        labelContainer.innerHTML = '';
        
        webcamContainer.appendChild(webcam.canvas);
        
        for (let i = 0; i < maxPredictions; i++) {
            const predictionDiv = document.createElement("div");
            predictionDiv.className = 'prediction-item';
            labelContainer.appendChild(predictionDiv);
        }

        // Reset button state
        startButtons.forEach(btn => {
            if (btn.getAttribute('onclick') === 'init()') {
                btn.innerHTML = 'Restart';
                btn.style.backgroundColor = '#007bff';
                btn.style.pointerEvents = 'auto';
            }
        });

    } catch (error) {
        alert(error.message);
        console.error('Error:', error);
        
        // Reset button state
        startButtons.forEach(btn => {
            if (btn.getAttribute('onclick') === 'init()') {
                btn.innerHTML = 'Start';
                btn.style.backgroundColor = '#007bff';
                btn.style.pointerEvents = 'auto';
            }
        });
    }
}

async function loop() {
    if (webcam && webcam.canvas) {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }
}

async function predict() {
    try {
        const prediction = await model.predict(webcam.canvas);
        const labelContainer = document.getElementById("label-container");
        
        // If we're in holding still mode, collect predictions
        if (isHoldingStill) {
            predictionHistory.push(prediction);
        }
        
        // Only update UI if we're not in holding still mode
        if (!isHoldingStill) {
            for (let i = 0; i < maxPredictions; i++) {
                const predictionDiv = labelContainer.children[i];
                predictionDiv.innerHTML = `Prediction: ${prediction[i].className} (${Math.round(prediction[i].probability * 100)}%)`;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function stopCamera() {
    if (webcam) {
        webcam.stop();
        const webcamContainer = document.getElementById('webcam-container');
        const labelContainer = document.getElementById('label-container');
        
        // Clear both containers
        webcamContainer.innerHTML = '';
        labelContainer.innerHTML = '';
        
        // Reset the global variables
        webcam = null;
        model = null;
        maxPredictions = 0;
    }
}

// Add this new function for permission handling
async function checkPermissions() {
    try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        return true;
    } catch (err) {
        alert('Camera access is required for this application to work');
        return false;
    }
}

async function startHoldStillPrediction() {
    if (!webcam || !model) {
        alert('Please start the camera first');
        return;
    }

    isHoldingStill = true;
    predictionHistory = [];
    let countdown = 5;
    
    const messageDiv = document.createElement('div');
    messageDiv.id = 'hold-still-message';
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translateX(-50%)';
    messageDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
    messageDiv.style.color = 'white';
    messageDiv.style.padding = '10px';
    messageDiv.style.borderRadius = '5px';
    document.body.appendChild(messageDiv);

    holdingTimer = setInterval(async () => {
        messageDiv.textContent = `Hold still for ${countdown} seconds...`;
        countdown--;

        if (countdown < 0) {
            clearInterval(holdingTimer);
            document.body.removeChild(messageDiv);
            isHoldingStill = false;

            // Calculate the most frequent prediction with highest confidence
            const mostConfidentPrediction = getMostConfidentPrediction(predictionHistory);
            
            // Display final result
            const labelContainer = document.getElementById("label-container");
            labelContainer.innerHTML = '';
            const resultDiv = document.createElement("div");
            resultDiv.className = 'prediction-item';
            resultDiv.innerHTML = `<strong>Final Prediction:</strong> ${mostConfidentPrediction.className} (${Math.round(mostConfidentPrediction.probability * 100)}%)`;
            labelContainer.appendChild(resultDiv);
        }
    }, 1000);
}

function getMostConfidentPrediction(predictions) {
    // Group predictions by className
    const grouped = predictions.reduce((acc, pred) => {
        pred.forEach(p => {
            if (!acc[p.className]) {
                acc[p.className] = [];
            }
            acc[p.className].push(p.probability);
        });
        return acc;
    }, {});

    // Calculate average probability for each class
    let highestProb = 0;
    let bestPrediction = null;

    Object.entries(grouped).forEach(([className, probabilities]) => {
        const avgProb = probabilities.reduce((a, b) => a + b, 0) / probabilities.length;
        if (avgProb > highestProb) {
            highestProb = avgProb;
            bestPrediction = { className, probability: avgProb };
        }
    });

    return bestPrediction;
}