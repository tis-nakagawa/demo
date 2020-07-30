"use strict";

function init() {
    document.getElementById("send").addEventListener("click", send);
}

function send() {
    let to = document.getElementById("to").value;
    let cc = document.getElementById("cc").value;
    let bcc = document.getElementById("bcc").value;
    let subject = document.getElementById("subject").value;
    let body = document.getElementById("body").value;
    location.href = "mailto:" + encodeURIComponent(to)
        + "?cc=" + encodeURIComponent(cc)
        + "&bcc=" + encodeURIComponent(bcc)
        // + "&subject=" + encodeURIComponent(subject)
        + "&body=" + encodeURIComponent(body);
}

function getFormatDate(target) {
    let format = null;
    if (target) {
        let now = new Date();
        let yyyy = now.getFullYear();
        let mm = (now.getMonth() < 9) ? ("0" + (now.getMonth() + 1)) : ("" + (now.getMonth() + 1));
        let dd = (now.getDate() < 10) ? ("0" + now.getDate()) : ("" + now.getDate());
        let HH = (now.getHours() < 10) ? ("0" + now.getHours()) : ("" + now.getHours());
        let MM = (now.getMinutes() < 10) ? ("0" + now.getMinutes()) : ("" + now.getMinutes());
        let ss = (now.getSeconds() < 10) ? ("0" + now.getSeconds()) : ("" + now.getSeconds());
        format = target;
        format = format.split("yyyy").join(yyyy);
        format = format.split("mm").join(mm);
        format = format.split("dd").join(dd);
        format = format.split("HH").join(HH);
        format = format.split("MM").join(MM);
        format = format.split("ss").join(ss);
        format = format.split("m").join("" + (now.getMonth() + 1));
        format = format.split("d").join("" + now.getDate());
        format = format.split("H").join("" + now.getHours());
        format = format.split("M").join("" + now.getMinutes());
        format = format.split("s").join("" + now.getSeconds());
    }
}

window.addEventListener("load", init);