
const p = 353;
const g = 3;

function init() {
    document.getElementById('x').addEventListener('change', chgX);
    document.getElementById('genX').addEventListener('click', genX);
    document.getElementById('calK').addEventListener('click', calK);
}

function chgX() {
    let x = document.getElementById('x').value;
    if (x) {
        let ya = Number((BigInt(g) ** BigInt(x)) % BigInt(p));
        document.getElementById('yax').innerHTML = x;
        document.getElementById('ybx').innerHTML = x;
        document.getElementById('ya').innerHTML = ya;
        document.getElementById('k').innerHTML = '';
    } else {
        document.getElementById('yax').innerHTML = 'X';
        document.getElementById('yx').innerHTML = 'X';
        document.getElementById('ya').innerHTML = '';
        document.getElementById('k').innerHTML = '';
    }
}

function genX() {
    let x = Math.floor(Math.random() * Math.floor(p));
    document.getElementById('x').value = x;
    chgX();
}

function calK() {
    let x = document.getElementById('x').value;
    let yb = document.getElementById('yb').value;
    if (x && yb) {
        let k = Number((BigInt(yb) ** BigInt(x)) % BigInt(p));
        document.getElementById('k').innerHTML = k;
    } else {
        document.getElementById('k').innerHTML = '';
    }
}

window.addEventListener('load', init);