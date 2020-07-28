"use strict";

const TAGS = ["gps", "qr", "qrr"];

function init() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(function (registration) {
            console.log('serviceWorker registration successful with scope:', registration.scope);
        }, function (err) {
            console.log('serviceWorker registration failed:', err.message);
        });
    } else {
        console.log('serviceWorker IS NOT available');
    }
    // Check navigator
    if ("geolocation" in navigator) {
        console.log('geolocation is available');
    } else {
        console.log('geolocation IS NOT available');
    }
    if ("mediaDevices" in navigator) {
        console.log('mediaDevices is available');
    } else {
        console.log('mediaDevices IS NOT available');
    }
    // Add tag change event
    for (let i = 0; i < TAGS.length; i++) {
        document.getElementById(TAGS[i]).addEventListener("change", changeTag);
    }
    changeTag();
}

function changeTag() {
    let tag = null;
    for (let i = 0; i < TAGS.length; i++) {
        if (document.getElementById(TAGS[i]).checked) {
            tag = TAGS[i];
            break;
        }
    }
    if (tag == "gps") {
        stopQR();
        stopQRReader();
        startGPS();
    } else if (tag == "qr") {
        stopGPS();
        stopQRReader();
        startQR();
    } else if (tag == "qrr") {
        stopGPS();
        stopQR();
        startQRReader();
    }
}

// GPS

var watchId = null;

function startGPS() {
    console.log("start GPS");
    if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(watchPos);
        setMap();
    }
}

function stopGPS() {
    console.log("stop GPS");
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
}

const INIT_POS = [35.689986792235985, 139.692417383194]; // 都庁

var map = null;

var pin = null;

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

// QR Code

const MODES = ["NUMBER", "ALPHA_NUM", "8bit"];

const LEVELS = ["M (Medium)", "L (Low)", "H (High)", "Q (Quartile)"];

var qr_reg_flg = false;

function startQR() {
    console.log("start QR");
    if (!qr_reg_flg) {
        document.getElementById("qrcreate").addEventListener("click", createQR);
        qr_reg_flg = true;
    }
}

function stopQR() {
    console.log("stop QR");
}

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
            c.width = (qr.modules.length + 8) * size;
            c.height = (qr.modules[0].length + 8) * size;
            ctx.fillStyle = 'black';
            for (let row = 0; row < qr.modules.length; row++) {
                for (let col = 0; col < qr.modules[row].length; col++) {
                    if (qr.modules[row][col]) {
                        ctx.fillRect((row + 4) * size, (col + 4) * size, size, size);
                    }
                }
            }
            info.innerHTML = ""
                + "Size&nbsp;&nbsp; : (" + c.width + "," + c.height + ")<br>"
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

// QR Code Reader

var cam = null;
var requestID = null;

function startQRReader() {
    console.log("start QR Reader");
    if ("mediaDevices" in navigator) {
        if (cam == null) {
            cam = document.createElement("video");
        }
        stopQRReader();
        navigator.mediaDevices.getUserMedia({
            audio: false, video: { facingMode: "environment" }
        }).then(handleSuccess);
    }
}

function stopQRReader() {
    console.log("stop QR Reader");
    if (requestID) {
        cancelAnimationFrame(requestID);
        requestID = null;
    }
    if (cam && cam.srcObject) {
        cam.srcObject.getTracks().forEach(function (track) { track.stop() });
    }
    let c = document.getElementById("cam");
    c.width = 0;
    c.height = 0;
    document.getElementById("qrdata").innerHTML = "";
}

function handleSuccess(stream) {
    console.log("handleSuccess", stream);
    cam.srcObject = stream;
    cam.setAttribute("playsinline", true);
    cam.play();
    if (!document.getElementById("qrr").checked) {
        stopQRReader();
    }
    console.log(cam.videoHeight, cam.videoWidth);
    requestID = requestAnimationFrame(setCam);
}

function setCam() {
    try {
        if (cam.readyState == HTMLMediaElement.HAVE_ENOUGH_DATA) {
            let c = document.getElementById("cam");
            c.width = cam.videoWidth / 2;
            c.height = cam.videoHeight / 2;
            let ctx = c.getContext("2d");
            ctx.drawImage(cam, 0, 0, c.width, c.height);
            var img = ctx.getImageData(0, 0, c.width, c.height);
            var code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert", });
            if (code && code.data) {
                let pos = [code.location.topLeftCorner, code.location.topRightCorner
                    , code.location.bottomRightCorner, code.location.bottomLeftCorner];
                for (let i = 0; i < pos.length; i++) {
                    ctx.beginPath();
                    ctx.moveTo(pos[i].x, pos[i].y);
                    ctx.lineTo(pos[(i + 1) % pos.length].x, pos[(i + 1) % pos.length].y);
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = "#0000ff";
                    ctx.stroke();
                }
                document.getElementById("qrdata").innerHTML = ""
                    + "Date : " + (new Date()) + "<br>"
                    + "Data : " + h(code.data) + "<br>"
                    + "";
                cam.pause();
                setTimeout(play, 2000);
            } else {
                requestID = requestAnimationFrame(setCam);
            }
        } else {
            requestID = requestAnimationFrame(setCam);
        }
    } catch (e) {
        alert(e.message);
    }
}

function h(str) {
    return String(str).replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function play() {
    if (cam.paused) {
        cam.setAttribute("playsinline", true);
        cam.play();
        setTimeout(function () { requestID = requestAnimationFrame(setCam) }, 1500);
    }
}


// Add init
window.addEventListener('load', init);
