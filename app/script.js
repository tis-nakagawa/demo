function init() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ' + registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ' + err);
        });
    } else {
        console.log('serviceWorker IS NOT available');
    }
    if ("geolocation" in navigator) {
        console.log('geolocation is available');
        watchID = navigator.geolocation.watchPosition(watchPos);
    } else {
        console.log('geolocation IS NOT available');
    }
    document.getElementById("qrcreate").addEventListener("click", createQR);
    setMap();
    let elements = document.getElementsByName("tag");
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("change", setMap);
    }
}

const INIT_POS = [35.689986792235985, 139.692417383194]; // 都庁

var map = null;
var lastPos = null;

function setMap() {
    if (map) {
        map.eachLayer(function (layer) {
            layer.remove();
        });
        map.remove();
        map = null;
        pin = null;
    }
    if (!document.getElementById("gps").checked) {
        return;
    }
    map = L.map('map');
    let tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 19
    });
    if (lastPos == null) {
        lastPos = INIT_POS;
    }
    tileLayer.addTo(map.setView(lastPos, 17));
    // 固定ピン設定
    L.marker(INIT_POS).addTo(map);
}

var pin = null;

function watchPos(position) {
    console.log(position.coords.latitude, position.coords.longitude);
    if (map) {
        lastPos = [position.coords.latitude, position.coords.longitude];
        map.setView(lastPos);
        if (pin) {
            // pin.setLatLng(pos);
            pin.moveTo(lastPos, 1000);
        } else {
            var myIcon = L.icon({
                iconUrl: 'sicon.png',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, 0]
            });
            // pin = L.marker(pos, { icon: myIcon, draggable: true }).addTo(map);
            pin = L.Marker.movingMarker([lastPos], [], { icon: myIcon, draggable: true }).addTo(map);
        }
    }
}

const MODES = ["NUMBER", "ALPHA_NUM", "8bit"];

const LEVELS = ["M (Medium)", "L (Low)", "H (High)", "Q (Quartile)"];

function createQR() {
    let modes = MODES.concat();
    let qr = null;
    let typeNumber = 0;
    let correction = parseInt(document.getElementById("qrlevel").value);
    let mode = document.getElementById("qrmode").value;
    let text = document.getElementById("qrtext").value;
    let info = document.getElementById("qrinfo");
    info.innerHTML = "";
    if (mode != "AUTO") {
        modes = [mode];
    }
    let inputMode = null;
    let c = document.getElementById("qrcode");
    let ctx = c.getContext('2d');
    for (let i = 0; i < modes.length; i++) {
        try {
            inputMode = modes[i];
            qr = new QRCode(typeNumber, correction, inputMode);
            qr.addData(text);
            qr.make();
            let size = 5;
            width = (qr.modules.length + 8) * size;
            height = (qr.modules[0].length + 8) * size;
            c.width = width;
            c.height = height;
            ctx.fillStyle = 'black';
            for (let row = 0; row < qr.modules.length; row++) {
                for (let col = 0; col < qr.modules[row].length; col++) {
                    if (qr.modules[row][col]) {
                        ctx.fillRect((row + 4) * size, (col + 4) * size, size, size);
                    }
                }
            }
            info.innerHTML = ""
                + "Size&nbsp;&nbsp; : (" + width + "," + height + ")<br>"
                + "Number : " + qr.typeNumber + "<br>"
                + "Level&nbsp; : " + LEVELS[correction] + "<br>"
                + "Mode&nbsp;&nbsp; : " + inputMode + "<br>"
                + "Text&nbsp;&nbsp; : " + text + "<br>"
                + "";
            break;
        } catch (e) {
            if (i + 1 != modes.length) {
                continue;
            }
            c.width = 0;
            c.height = 0;
            info.innerHTML = "Error&nbsp; : " + e.message + "<br>"
                + "Level&nbsp; : " + LEVELS[correction] + "<br>"
                + "Mode&nbsp;&nbsp; : " + inputMode + "<br>"
                + "Text&nbsp;&nbsp; : " + text + "<br>"
                + "";
        }
    }
}

window.addEventListener('load', init);
