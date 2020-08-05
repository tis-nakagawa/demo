"use strict";

const KEY = "templates";

const TAGS = ["mtag", "ttag", "stag"];

var templs = [];

function init() {
    initMail();
    initTemplate();
    initSetting();
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
    if (tag == "mtag") {
        stopTemplate();
        stopSetting();
        startMail();
    } else if (tag == "ttag") {
        stopMail();
        stopSetting();
        startSetting();
    } else if (tag == "stag") {
        stopMail();
        stopTemplate();
        startSetting();
    }
}

// Mail

function initMail() {
    document.getElementById("send").addEventListener("click", send);
    if (localStorage) {
        document.getElementById("save").addEventListener("click", save);
        let json = localStorage.getItem(KEY);
        if (json) {
            templs = JSON.parse(json);
        }
    }
}

function startMail() {

}

function stopMail() {

}

function send() {
    let to = document.getElementById("to").value;
    let param = [];
    let cc = document.getElementById("cc").value;
    if (cc) {
        param.push("cc=" + encodeURIComponent(cc));
    }
    let bcc = document.getElementById("bcc").value;
    if (bcc) {
        param.push("bcc=" + encodeURIComponent(bcc));
    }
    let subject = document.getElementById("subject").value;
    if (subject) {
        subject = setDate(subject);
        param.push("subject=" + encodeURIComponent(subject));
    }
    let body = document.getElementById("body").value;
    if (body) {
        body = setDate(body);
        param.push("body=" + encodeURIComponent(body));
    }
    location.href = "mailto:" + encodeURIComponent(to) + "?" + param.join("&");
}

const FORMATS = {
    __mmdd__: "mm/dd",
    __md__: "m/d",
};

function setDate(target) {
    let str = target;
    for (let key in FORMATS) {
        str = str.split(key).join(getFormatDate(FORMATS[key]));
    }
    return str;
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

function save() {
    if (confirm("現在のメールをテンプレートに保存します。\nよろしいですか？")) {
        let to = document.getElementById("to").value;
        let cc = document.getElementById("cc").value;
        let bcc = document.getElementById("bcc").value;
        let subject = document.getElementById("subject").value;
        let body = document.getElementById("body").value;
        let templ = {
            to: to,
            cc: cc,
            bcc: bcc,
            subject: subject,
            body: body,
        };
        templs.push(templ);
        localStorage.setItem(KEY, JSON.stringify(templs));
    }
}

// Template

function initTemplate() {

}

function startTemplate() {

}

function stopTemplate() {

}

// Setting

function initSetting() {

}

function startSetting() {

}

function stopSetting() {

}

// Load
window.addEventListener("load", init);