function timeToString(time) {
    let d = new Date(0);
    d.setUTCSeconds(time);
    return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
}
function pad(d) {
    if (d < 10) {
        return '0' + d;
    }
    else {
        return d;
    }
}
export { timeToString }