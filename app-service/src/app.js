let deviceState = {};

// database import
const {mongoose, model} = require('./db.model');
mongoose.connect(process.env.DB_LINK, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


// mq import
const aedes = require('aedes')();
const mqserver = require('net').createServer(aedes.handle);
mqserver.listen(process.env.MQ_PORT, () => console.log("MQTT listening on", process.env.MQ_PORT));


// ws import
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.WS_PORT }, () => console.log("WS is listening on", process.env.WS_PORT));


// mq sub -> ws pub
aedes.on("clientReady", c => {
    deviceState[c.id] = deviceState[c.id] || {};
    deviceState[c.id].DEVICE_STATUS = true;
    ws_broadcast(c.id, "STATE", deviceState[c.id]);
});
aedes.on("clientDisconnect", c => {
    deviceState[c.id] = deviceState[c.id] || {};
    deviceState[c.id].DEVICE_STATUS = false;
    ws_broadcast(c.id, "STATE", deviceState[c.id]);
});
aedes.subscribe("HALLO/#", (a,cb) => {
    const topic = a.topic.split('/');
    const name = topic[1];
    const command = topic[2];
    const msg = JSON.parse(a.payload.toString());
    deviceState[name] = deviceState[name] || {};

    console.log(topic, msg);

    switch(command) {
        case "count":
            console.log("count:", deviceState[name].count, msg.payload);
            updateState(name, {[command]: (deviceState[name].count + msg.payload) || 1});
            ws_broadcast(name, "STATE", deviceState[name]);
            db_savedata(name, {
                COMMAND: command,
                VALUE: msg.payload,
            })
            break;
        default:
            updateState(name, {[command]: msg.payload});
            ws_broadcast(name, "STATE", deviceState[name]);
            db_savedata(name, {
                COMMAND: command,
                VALUE: msg.payload,
            })
    }

    cb();
});


// ws sub
wss.on('connection', (ws) => {
    ws.send(JSON.stringify({
        command: "SERVER_STATE",
        payload: deviceState
    }));
    ws.on('message', (message) => {
        parsedMsg = JSON.parse(message);
        console.log(parsedMsg);
        ws_handleIncoming(ws, parsedMsg.command, parsedMsg.value);
    });
});

syncState();

function ws_broadcast(device, command, payload) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                device,
                command, 
                payload,
            }));
        }
    });
}



async function db_savedata(name, data) {
    if(
        data.COMMAND && 
        data.VALUE
    ) {
        // simpan ke DB
        try{
            let dataToSave = {
                ...data,
                TIMESTAMP: new Date(),
            };
            const save = await model.data.updateOne(
                { NAMA_MESIN: name, DATE_FROM: new Date((new Date()).setSeconds(0,0)) },
                {
                    $push: {
                        DATA: dataToSave,
                    },
                    $inc: { DATA_COUNT: (data.COMMAND == "count" ? 1 : 0) },
                    $setOnInsert: { 
                        NAMA_MESIN: name, 
                        DATE_FROM: new Date((new Date()).setSeconds(0,0)),
                        DATE_TO: new Date((new Date()).setSeconds(60,0)),
                    },
                },
                { upsert: true }
            );
        } catch(e) {
            console.error(e)
        }
    }
}



async function syncState() {

    let dbData = await db_getdata({
        DATE_FROM: {$gte: new Date((new Date()).setHours(0,0,0,0))} 
    });

    if(Array.isArray(dbData)){
        let punchCount = dbData.reduce((pre, cur) => {
            if(pre[cur.NAMA_MESIN] === undefined) pre[cur.NAMA_MESIN] = 0;
            pre[cur.NAMA_MESIN] += cur.DATA_COUNT;
            return pre;
        }, {});

        console.log("punchCount", punchCount);

        for (mesin in punchCount) {
            updateState(mesin, {count: punchCount[mesin]});
        }
    }

    setTimeout(() => syncState(), 6e4);

}



async function db_getdata(query) {
    try {
        const result = await model.data.find(query);
        return result;
    } catch(e) {
        console.error(e);
    }
    return;
}



function mq_publish(topic, payload) {
    aedes.publish({
        topic,
        payload: JSON.stringify({
            success: true,
            payload
        })
    });
}



function ws_handleIncoming(client, command, value) {
    switch(command) {
        case "GET_STATE":
            client.send(JSON.stringify({
                command,
                payload: deviceState
            }));
            break;
        case "DATA":
            client.send(JSON.stringify({
                command, 
                payload: dataBuffer,
            }));
    }
}



function updateState(name, obj) {
    for (const state in obj) {
        if(deviceState[name] === undefined) deviceState[name] = {};
        deviceState[name][state] = obj[state];
    }
}