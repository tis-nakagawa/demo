"use strict"

function init() {
    document.getElementById("cbtn").addEventListener("click", demo);
}

function demo() {
    let data = [];
    for (let i = 0; i < 60; i++) {
        data.push(Math.floor(Math.random() * Math.floor(256)));
    }
    document.getElementById("hex").innerHTML = hex(data);
    createBytesQR(data);
}

function hex(bs) {
    let h = "";
    for (let i = 0; i < bs.length; i++) {
        if (i != 0 && i % 16 == 0) {
            h += "<br>";
        }
        h += ("0" + bs[i].toString(16)).slice(-2);
    }
    return h;
}

function QRBytes(data) {
    this.mode = 4;
    this.data = data;
}

QRBytes.prototype.getLength = function (buffer) {
    return this.data.length;
}

QRBytes.prototype.write = function (buffer) {
    for (var i = 0; i < this.data.length; i++) {
        buffer.put(this.data[i], 8);
    }
}

function createBytesQR(data) {
    // 表示部分クリア
    document.getElementById("qrcode").innerHTML = "";
    // 一時領域確保、データ数
    let tmp = "";
    for (let i = 0; i < data.length; i++) {
        tmp += ' ';
    }
    // 一時データでQR作成
    let qrcode = new QRCode("qrcode", {
        text: tmp,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L
    });
    let newData = new QRBytes(data);
    qrcode._oQRCode.dataList[0] = newData;
    qrcode._oQRCode.dataCache = null;
    qrcode._oQRCode.make();
    qrcode._el.title = "bin";
    qrcode._oDrawing.draw(qrcode._oQRCode);
    qrcode.makeImage();
}

window.addEventListener("load", init);