let switches = JSON.parse(localStorage.getItem('switches')) || [];
let cameras = JSON.parse(localStorage.getItem('cameras')) || [];

// Login functionality
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        window.location.href = 'index.html'; // Redirect to the main page
    } else {
        alert('Invalid credentials!');
    }
});

// Logout functionality
document.getElementById('logoutButton')?.addEventListener('click', function() {
    localStorage.removeItem('username'); // Adjust based on your implementation
    window.location.href = 'login.html';
});

// Function to add a switch
document.getElementById('switchForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const brand = document.getElementById('switchBrand').value;
    const location = document.getElementById('switchLocation').value;
    const ip = document.getElementById('switchIP').value;
    const mac = document.getElementById('switchMAC').value;
    const ports = document.getElementById('switchPorts').value;

    const newSwitch = { brand, location, ip, mac, ports };
    switches.push(newSwitch);
    localStorage.setItem('switches', JSON.stringify(switches));
    updateSwitchOptions();
    this.reset();
});

// Function to add a camera
document.getElementById('cameraForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const brand = document.getElementById('cameraBrand').value;
    const location = document.getElementById('cameraLocation').value;
    const ip = document.getElementById('cameraIP').value;
    const mac = document.getElementById('cameraMAC').value;
    const connectedSwitch = document.getElementById('connectedSwitch').value;
    const cameraPort = document.getElementById('cameraPort').value;

    const newCamera = { brand, location, ip, mac, connectedSwitch, cameraPort };
    cameras.push(newCamera);
    localStorage.setItem('cameras', JSON.stringify(cameras));
    this.reset();
});

// Function to update the switch dropdown in the camera form
function updateSwitchOptions() {
    const select = document.getElementById('connectedSwitch');
    select.innerHTML = '<option value="">Select Switch</option>';
    switches.forEach((s, index) => {
        select.innerHTML += `<option value="${index}">${s.brand} - ${s.location}</option>`;
    });
}

// Search functionality for index.html
document.getElementById('searchButton')?.addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const searchType = document.getElementById('searchType').value;
    const resultsDiv = document.getElementById('searchResults');

    if (!searchTerm) {
        alert('Please enter a search value');
        return;
    }

    let results = [];
    
    if (searchType === 'camera') {
        results = cameras.filter(camera =>
            camera.brand.toLowerCase().includes(searchTerm) ||
            camera.location.toLowerCase().includes(searchTerm)
        );

        if (results.length === 0) {
            resultsDiv.innerHTML = 'Not found camera';
        } else {
            resultsDiv.innerHTML = results.map(camera => 
                `Camera Brand: ${camera.brand}<br>Camera IP: ${camera.ip}<br>
                The camera is connected to the ${camera.cameraPort} port of the ${switches[camera.connectedSwitch].brand} switch.<br>
                MAC: ${camera.mac}<br>Location: ${camera.location}`
            ).join('<hr>');
        }
    } else if (searchType === 'switch') {
        results = switches.filter(switchItem =>
            switchItem.brand.toLowerCase().includes(searchTerm) ||
            switchItem.location.toLowerCase().includes(searchTerm)
        );

        if (results.length === 0) {
            resultsDiv.innerHTML = 'Not found switch';
        } else {
            resultsDiv.innerHTML = results.map(switchItem => {
                const connectedCameras = cameras.filter(camera => camera.connectedSwitch === switches.indexOf(switchItem));
                return `Switch Brand: ${switchItem.brand}<br>Switch IP: ${switchItem.ip}<br>
                Connected Camera: ${connectedCameras.length} cameras are connected to this switch.<br>
                ${connectedCameras.map(camera => `${camera.brand} (Port ${camera.cameraPort})`).join('<br>')}`;
            }).join('<hr>');
        }
    }
});

// Populate switches dropdown on page load in add.html
updateSwitchOptions();
