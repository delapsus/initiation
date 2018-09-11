
export function formatDate(d) {

    if (typeof d === 'undefined' || d === null) return "";

    if (typeof d === 'string') d = new Date(d);

    let year = d.getUTCFullYear().toString();
    let month = (d.getUTCMonth() + 1).toString();
    let day = d.getUTCDate().toString();

    if (month.length === 1) month = "0" + month;
    if (day.length === 1) day = "0" + day;

    return `${year}-${month}-${day}`;
}

export function formatTime(time) {

    if (time === null) return "";

    let d = new Date(time * 24*60*60*1000);

    let hour = d.getUTCHours().toString();
    let minute = d.getMinutes().toString();

    if (hour.length === 1) hour = "0" + hour;
    if (minute.length === 1) minute = "0" + minute;

    return `${hour}:${minute}`;
}

export function putObjectInLines(o) {
    let lines = [];

    //lines.push('<div>{</div>');
    for (let key in o) {
        if (o[key] === null) {

        }
        else if (typeof o[key] === 'object' && Array.isArray(o[key])) {
            lines.push(`<div class="indent">${key}: [</div>`);
            lines.push(`<div class="indent">${putObjectInLines(o[key])}</div>`);
            lines.push(`<div class="indent">}]</div>`);
        }
        else if (typeof o[key] === 'object') {
            lines.push(`<div class="indent">${key}: {</div>`);
            lines.push(`<div class="indent">${putObjectInLines(o[key])}</div>`);
            lines.push(`<div class="indent">}</div>`);
        }
        else {
            lines.push(`<div class="indent">${key}: ${o[key]}</div>`);
        }

    }
    //lines.push('<div>}</div>');
    return lines.join('\n');
}


export function getInitiationDate(init) {

    if (init === null) return "";

    let date = init.data.actualDate || null;
    let noActualDate = date === null;
    date = date || init.data.proposedDate || init.data.signedDate || init.data.localBodyDate || init.data.reportedDate;

    let actualDate = formatDate(date);
    if (noActualDate && actualDate.length > 0) actualDate = "[" + actualDate + "]";
    return actualDate;
}