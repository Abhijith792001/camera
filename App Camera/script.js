function getDevices() {
    return JSON.parse(localStorage.getItem('devices')) || [];
}

function addDeviceToLocalStorage(device) {
    const devices = getDevices();
    devices.push(device);
    localStorage.setItem('devices', JSON.stringify(devices));
}

function populateSwitchOptions() {
    const switchSelect = document.getElementById('cameraSwitch');
    switchSelect.innerHTML = ''; // Clear previous options
    const devices = getDevices().filter(device => device.type === 'switch');

    devices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.brand; // Use the brand as the value
        option.textContent = device.brand; // Display the brand name
        switchSelect.appendChild(option);
    });
}

function populatePortOptions() {
    const switchBrand = document.getElementById('cameraSwitch').value;
    const switchPortSelect = document.getElementById('cameraPort');
    switchPortSelect.innerHTML = ''; // Clear previous options

    const devices = getDevices();
    const selectedSwitch = devices.find(device => device.type === 'switch' && device.brand === switchBrand);

    if (selectedSwitch && selectedSwitch.ports) {
        // Populate ports for the selected switch
        selectedSwitch.ports.forEach(port => {
            const option = document.createElement('option');
            option.value = port; // Use the port as value
            option.textContent = port; // Display the port number
            switchPortSelect.appendChild(option);
        });
    }
}

function displayResults(results) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.innerHTML = '<p class="text-danger">No devices found.</p>';
    } else {
        results.forEach(device => {
            const resultHTML = `<div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${device.type === 'camera' ? device.brand + ' (Camera)' : device.brand + ' (Switch)'}</h5>
                    <p class="card-text">IP: ${device.ip}</p>
                    <p class="card-text">Location: ${device.location}</p>
                    <p class="card-text">MAC: ${device.mac}</p>
                    ${device.type === 'camera' ? `<p class="card-text">Connected to: ${device.switch} through port ${device.port}</p>` : ''}
                    <button class="btn btn-danger" onclick="deleteDevice('${device.brand}')">Delete</button>
                </div>
            </div>`;
            resultsDiv.innerHTML += resultHTML;
        });
    }
}

function searchDevice(event) {
    event.preventDefault();
    const query = document.getElementById('searchQuery').value.toLowerCase();
    const deviceType = document.getElementById('deviceTypeFilter').value;
    const devices = getDevices();

    const results = devices.filter(device => {
        const matchesQuery = device.ip.toLowerCase().includes(query) ||
                             device.mac.toLowerCase().includes(query) ||
                             device.location.toLowerCase().includes(query) ||
                             device.brand.toLowerCase().includes(query);

        const matchesType = deviceType ? device.type === deviceType : true;

        return matchesQuery && matchesType;
    });

    displayResults(results);
}

function deleteDevice(brand) {
    let devices = getDevices();
    devices = devices.filter(device => device.brand.toLowerCase() !== brand.toLowerCase());
    localStorage.setItem('devices', JSON.stringify(devices));
    alert(`Device with brand ${brand} deleted successfully.`);
    searchDevice(new Event('submit')); // Refresh search results
}

function clearSearch() {
    document.getElementById('searchQuery').value = '';
    document.getElementById('deviceTypeFilter').value = '';
    searchDevice(new Event('submit')); // Refresh results
}

function addDevice() {
    const deviceType = document.getElementById('deviceType').value;
    const device = {
        brand: deviceType === 'camera' ? document.getElementById('cameraBrand').value : document.getElementById('switchBrand').value,
        ip: deviceType === 'camera' ? document.getElementById('cameraIP').value : document.getElementById('switchIP').value,
        location: deviceType === 'camera' ? document.getElementById('cameraLocation').value : document.getElementById('switchLocation').value,
        mac: deviceType === 'camera' ? document.getElementById('cameraMAC').value : document.getElementById('switchMAC').value,
        type: deviceType,
    };

    if (deviceType === 'camera') {
        device.switch = document.getElementById('cameraSwitch').value;
        device.port = document.getElementById('cameraPort').value;
    } else if (deviceType === 'switch') {
        device.ports = ['Port 1', 'Port 2']; // Example ports for switch, modify as needed
    }

    addDeviceToLocalStorage(device);
    alert(`${device.brand} added successfully.`);
    document.getElementById('deviceForm').reset();
    populateSwitchOptions(); // Refresh switch options after adding a device
}

function toggleForms() {
    const deviceType = document.getElementById('deviceType').value;
    document.getElementById('cameraForm').style.display = deviceType === 'camera' ? 'block' : 'none';
    document.getElementById('switchForm').style.display = deviceType === 'switch' ? 'block' : 'none';

    // Reset forms
    document.getElementById('cameraForm').reset();
    document.getElementById('switchForm').reset();
    populateSwitchOptions(); // Populate switch options when toggling forms
}

// Event listener for switch selection change
document.getElementById('cameraSwitch').addEventListener('change', populatePortOptions);

// Populate switch options on page load
window.onload = function() {
    populateSwitchOptions();
};
