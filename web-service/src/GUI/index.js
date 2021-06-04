import Device from './component/device.js';
import BasicComponent from './component/basic-component.js';

var wsUri = `ws://${location.hostname}:${+location.port+1}`;
var websocket = new WebSocket(wsUri);

function ws_load() {
    console.log("opening websocket ...");
    websocket.onopen    = ws_onOpen;
    websocket.onclose   = ws_onClose;
    websocket.onmessage = ws_onMessage;
    websocket.onerror   = ws_onError;
}

function ws_send(command, value) {
    websocket.send(JSON.stringify({
        command,
        value
    }))
}
      
function ws_onOpen(evt) {
    console.log("websocket opened...");
}
      
function ws_onClose(evt) {
    console.log("websocket closed...");
    setTimeout(() => location.reload(), 1000);
}

function ws_onMessage(evt) {
    let parsedEvt = JSON.parse(evt.data);
    console.log(parsedEvt);
}

const devices = {};

function ws_onError(evt) {
    console.log(`WS: ${evt.type}`);
    console.log(evt.data);
}

const deviceHolder = new BasicComponent({
    parent: document.body,
    style: {
        display: "grid",
        margin: "1em",
        gridTemplateColumns: "1fr",
        gridAutoFlow: "row",
        gap: "1em"
    }
});

const run = () => {
    ws_load();
}

document.addEventListener("DOMContentLoaded", run)