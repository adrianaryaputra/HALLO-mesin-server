import BasicComponent from './basic-component.js';
import LabelText from './label-text.js';
import TitleText from './title-text.js';
import Indicator from './indicator.js';
import ChartComponent from './chart.js';



export default class Device extends BasicComponent{

    constructor(name, state = {}, options) {
        super(options);
        this.name = name;
        this.draw();
        this.update(state);
        this.stylize(this.element(), {
            display: "grid",
            gap: ".3em",
            backgroundColor: "rgba(255,255,255,0.1)",
            fontSize: "1.2rem",
            padding: "1em",
            borderRadius: "1em",
        });
    }

    update(state) {
        this.state = state;
        for (const key in state) {
            switch(key) {
                case "DEVICE_STATUS":
                    this.deviceStatus.toggle(state[key]);
                    break;
                case "AI":
                    this.millMotorTopS.setValue(state[key][0].toFixed(2));
                    this.millMotorTopC.setValue(state[key][1].toFixed(2));
                    this.millMotorBtmS.setValue(state[key][2].toFixed(2));
                    this.millMotorBtmC.setValue(state[key][3].toFixed(2));
                    this.coilerMotorS.setValue(state[key][4].toFixed(2));
                    this.coilerMotorC.setValue(state[key][5].toFixed(2));
                    break;

                case "DI":
                    this.motorPK1.toggle(state[key][1] === false);
                    this.motorPK2.toggle(state[key][0] === false);
                    this.coolingTower1.toggle(state[key][13] === false);
                    this.coolingTower2.toggle(state[key][3] === false);
                    this.motorPB1.toggle(state[key][4] === false);
                    this.motorPB2.toggle(state[key][5] === true);
                    this.motorBending1.toggle(state[key][7] === true);
                    this.motorBending2.toggle(state[key][8] === true);
                    this.millON.toggle(state[key][11] === false);
                    this.coilerON.toggle(state[key][12] === false);
                    this.oilCoolant.toggle(state[key][6] === true);
                    this.hidrolikPK.toggle(state[key][9] === true);
                    this.hidrolikPB.toggle(state[key][10] === true);
                    break;
                
                case "TEMP":
                    this.tempInputAl.setValue(state[key][0].toFixed(2));
                    this.tempCastAl.setValue(state[key][1].toFixed(2));
                    this.tempCoolInTop.setValue(state[key][2].toFixed(2));
                    this.tempCoolInBtm.setValue(state[key][3].toFixed(2));
                    this.tempCoolOutTop.setValue(state[key][4].toFixed(2));
                    this.tempCoolOutBtm.setValue(state[key][5].toFixed(2));
                    break;
                
                case "DATA":
                    // console.log("RECV DATA", state[key]);
                    // console.log("chartTemp", this.chartTemp);
                    setChart(
                        this.chartTempAlloy,
                        state[key].map(v => new Date(v.TIMESTAMP)),
                        transpose(state[key].map(v => [v.TEMP[1], v.TEMP[0]]))
                    );
                    setChart(
                        this.chartTempCooler,
                        state[key].map(v => new Date(v.TIMESTAMP)),
                        transpose(state[key].map(v => v.TEMP.slice(2,6)))
                    );
                    setChart(
                        this.chartSpeed,
                        state[key].map(v => new Date(v.TIMESTAMP)),
                        transpose(state[key].map(v => [v.AI[0], v.AI[2], v.AI[4]]))
                    );
                    setChart(
                        this.chartAmp,
                        state[key].map(v => new Date(v.TIMESTAMP)),
                        transpose(state[key].map(v => [v.AI[1], v.AI[3], v.AI[5]]))
                    );
            }
        }
        return this;
    }

    draw() {
        this.headerHolder = new BasicComponent({
            parent: this.element(),
            style: {
                fontSize: "1.5rem",
                margin: "0 0 var(--normal) .3em",
                display: "grid",
                gridTemplateColumns: "minmax(max-content, 1fr) 200px",
                alignItem: "center"
            }
        });

        const indicatorStyle = {
            padding: ".5em"
        }

        this.deviceName     = new TitleText(this.name, { parent: this.headerHolder.element(), style:{ fontSize: "1.2em" } });
        this.deviceStatus   = new Indicator({ valueON: "ONLINE", valueOFF: "OFFLINE" }, { parent: this.headerHolder.element(), style: {padding:".2em"} });

        this.analogData     = new BasicComponent({
            parent: this.element(),
            style: {
                display: "grid",
                margin: "1em 0",
                gridTemplateColumns: "repeat(2, minmax(340px, 1fr))",
                gap: ".5em 2.5em"
            }
        });

        this.millMotorTopS  = new LabelText({label:"Mill Top Spd.", value:"###", unit:"mm/min"}, { parent: this.analogData.element() });
        this.millMotorTopC  = new LabelText({label:"Mill Top Cur.", value:"###", unit:"Ampere"}, { parent: this.analogData.element() });

        this.millMotorBtmS  = new LabelText({label:"Mill Bottom Spd.", value:"###", unit:"mm/min"}, { parent: this.analogData.element() });
        this.millMotorBtmC  = new LabelText({label:"Mill Bottom Cur.", value:"###", unit:"Ampere"}, { parent: this.analogData.element() });

        this.coilerMotorS   = new LabelText({label:"Coiler Motor Spd.", value:"###", unit:"rpm"}, { parent: this.analogData.element() });
        this.coilerMotorC   = new LabelText({label:"Coiler Motor Cur.", value:"###", unit:"Ampere"}, { parent: this.analogData.element() });


        this.tempInputAl        = new LabelText({label:"Input Alum. Temp.", value:"###", unit:"°C"}, { parent: this.analogData.element() });
        this.tempCastAl         = new LabelText({label:"Cast Alum. Temp.", value:"###", unit:"°C"}, { parent: this.analogData.element() });

        this.tempCoolInTop      = new LabelText({label:"Cool Top In Temp.", value:"###", unit:"°C"}, { parent: this.analogData.element() });
        this.tempCoolOutTop     = new LabelText({label:"Cool Top Out Temp.", value:"###", unit:"°C"}, { parent: this.analogData.element() });
        
        this.tempCoolInBtm      = new LabelText({label:"Cool Btm In Temp.", value:"###", unit:"°C"}, { parent: this.analogData.element() });
        this.tempCoolOutBtm     = new LabelText({label:"Cool Btm Out Temp.", value:"###", unit:"°C"}, { parent: this.analogData.element() });

        this.digitalData    = new BasicComponent({
            parent: this.element(),
            style: {
                display: "grid",
                margin: "1em 0",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gridAutoFlow: "row",
                gap: "1em"
            }
        });

        this.motorPK1       = new Indicator({ valueON: "Motor PK1",         valueOFF: "Motor PK1",         }, { parent: this.digitalData.element(), style: indicatorStyle });
        this.motorPK2       = new Indicator({ valueON: "Motor PK2",         valueOFF: "Motor PK2",         }, { parent: this.digitalData.element(), style: indicatorStyle });
        this.coolingTower1  = new Indicator({ valueON: "Cooling Twr. 1",    valueOFF: "Cooling Twr. 1",    }, { parent: this.digitalData.element(), style: indicatorStyle });
        this.coolingTower2  = new Indicator({ valueON: "Cooling Twr. 2",    valueOFF: "Cooling Twr. 2",    }, { parent: this.digitalData.element(), style: indicatorStyle });
        this.motorPB1       = new Indicator({ valueON: "Motor PB1",         valueOFF: "Motor PB1",         }, { parent: this.digitalData.element(), style: indicatorStyle });
        this.motorPB2       = new Indicator({ valueON: "Motor PB2",         valueOFF: "Motor PB2",         }, { parent: this.digitalData.element(), style: indicatorStyle });
        this.motorBending1  = new Indicator({ valueON: "Motor Bnd. 1",      valueOFF: "Motor Bnd. 1",      }, { parent: this.digitalData.element(), style: indicatorStyle });
        this.motorBending2  = new Indicator({ valueON: "Motor Bnd. 2",      valueOFF: "Motor Bnd. 2",      }, { parent: this.digitalData.element(), style: indicatorStyle });
        this.millON         = new Indicator({ valueON: "Mill",              valueOFF: "Mill",              }, { parent: this.digitalData.element(), style: indicatorStyle });
        this.coilerON       = new Indicator({ valueON: "Coiler",            valueOFF: "Coiler",            }, { parent: this.digitalData.element(), style: indicatorStyle });
        this.oilCoolant     = new Indicator({ valueON: "Oil Coolant",       valueOFF: "Oil Coolant",       }, { parent: this.digitalData.element(), style: indicatorStyle });
        this.hidrolikPK     = new Indicator({ valueON: "Hidrolik PK",       valueOFF: "Hidrolik PK",       }, { parent: this.digitalData.element(), style: indicatorStyle });
        this.hidrolikPB     = new Indicator({ valueON: "Hidrolik PB",       valueOFF: "Hidrolik PB",       }, { parent: this.digitalData.element(), style: indicatorStyle });

        this.chartData    = new BasicComponent({
            parent: this.element(),
            style: {
                display: "grid",
                margin: "1em 0",
                gridTemplateRow: "repeat(4 200px)",
                gap: "1em"
            }
        });

        this.chartSpeedHold = new BasicComponent({
            parent: this.chartData.element(),
            style: {
                position: "relative",
                height: "200px",
            }
        });
        this.chartSpeed     = createSpeedChart({parent: this.chartSpeedHold.element()});

        this.chartAmpHold = new BasicComponent({
            parent: this.chartData.element(),
            style: {
                position: "relative",
                height: "200px",
            }
        });
        this.chartAmp     = createAmpChart({parent: this.chartAmpHold.element()});

        this.chartTempAlloyHold  = new BasicComponent({
            parent: this.chartData.element(),
            style: {
                position: "relative",
                height: "200px",
            }
        });
        this.chartTempAlloy      = createTempAlloyChart({parent: this.chartTempAlloyHold.element()});

        this.chartTempCoolerHold  = new BasicComponent({
            parent: this.chartData.element(),
            style: {
                position: "relative",
                height: "200px",
            }
        });
        this.chartTempCooler      = createTempCoolerChart({parent: this.chartTempCoolerHold.element()});
    }

}


function transpose(array){ 
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}


function createSpeedChart({
    parent, 
    style = {
        margin: "2em 1em 1em 1em",
    }
}) {

    let dp = {};
    let yesterday = (new Date(Date.now() - (864e5/2))).setSeconds(0,0);
    let current = new Date().setSeconds(0,0);
    dp[new Date(yesterday).toISOString()] = 0;
    dp[new Date(current).toISOString()] = 0;

    const labels = Object.keys(dp).map(v => new Date(v));
    const datapoints = Object.values(dp);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Mill Top Speed (mm/min)',
            data: datapoints,
            borderColor: "rgba(255,100,100,.5)",
            backgroundColor: "rgba(100,255,100,0)",
            pointRadius: 1,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        }, {
            label: 'Mill Bottom Speed (mm/min)',
            data: datapoints,
            borderColor: "rgba(100,255,100,.5)",
            backgroundColor: "rgba(100,100,255,0)",
            pointRadius: 1,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        }, {
            label: 'Coiler Motor Speed (rpm)',
            data: datapoints,
            borderColor: "rgba(100,100,255,.5)",
            backgroundColor: "rgba(100,100,255,0)",
            pointRadius: 1,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        },]
    };
    
    const chartConfig = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false,
                    text: ''
                },
            },
            interaction: {
                intersect: false,
                axis: 'x',
            },
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "hour",
                        tooltipFormat: 'DD/MM/YYYY HH:mm'
                    },
                    title: {
                        display: true
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    },
                    suggestedMin: 0,
                    suggestedMax: 1,
                }
            }
        },
    };
    
    return new ChartComponent(chartConfig, {
        height: "auto",
        width: "auto",
    }, {
        parent: parent,
        style: {
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            bottom: "0",
        }
    });
}


function createAmpChart({
    parent, 
    style = {
        margin: "2em 1em 1em 1em",
    }
}) {

    let dp = {};
    let yesterday = (new Date(Date.now() - (864e5/2))).setSeconds(0,0);
    let current = new Date().setSeconds(0,0);
    dp[new Date(yesterday).toISOString()] = 0;
    dp[new Date(current).toISOString()] = 0;

    const labels = Object.keys(dp).map(v => new Date(v));
    const datapoints = Object.values(dp);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Mill Top Current (Amp)',
            data: datapoints,
            borderColor: "rgba(255,100,100,.5)",
            backgroundColor: "rgba(100,255,100,0)",
            pointRadius: 1,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        }, {
            label: 'Mill Bottom Current (Amp)',
            data: datapoints,
            borderColor: "rgba(100,255,100,.5)",
            backgroundColor: "rgba(100,100,255,0)",
            pointRadius: 1,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        }, {
            label: 'Coiler Motor Current (Amp)',
            data: datapoints,
            borderColor: "rgba(100,100,255,.5)",
            backgroundColor: "rgba(100,100,255,0)",
            pointRadius: 1,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        }]
    };
    
    const chartConfig = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false,
                    text: ''
                },
            },
            interaction: {
                intersect: false,
                axis: 'x',
            },
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "hour",
                        tooltipFormat: 'DD/MM/YYYY HH:mm'
                    },
                    title: {
                        display: true
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    },
                    suggestedMin: 0,
                    suggestedMax: 1,
                }
            }
        },
    };
    
    return new ChartComponent(chartConfig, {
        height: "auto",
        width: "auto",
    }, {
        parent: parent,
        style: {
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            bottom: "0",
        }
    });
}


function createTempAlloyChart({
    parent, 
    style = {
        margin: "2em 1em 1em 1em",
    }
}) {

    let dp = {};
    let yesterday = (new Date(Date.now() - (864e5/2))).setSeconds(0,0);
    let current = new Date().setSeconds(0,0);
    dp[new Date(yesterday).toISOString()] = 0;
    dp[new Date(current).toISOString()] = 0;

    const labels = Object.keys(dp).map(v => new Date(v));
    const datapoints = Object.values(dp);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Input Alu. Temp.',
            data: datapoints,
            borderColor: "rgba(255,100,100,.5)",
            backgroundColor: "rgba(255,100,100,0)",
            pointRadius: 1,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        }, {
            label: 'Cast Alu. Temp.',
            data: datapoints,
            borderColor: "rgba(100,255,100,.5)",
            backgroundColor: "rgba(100,255,100,0)",
            pointRadius: 1,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        }]
    };
    
    const chartConfig = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false,
                    text: ''
                },
            },
            interaction: {
                intersect: false,
                axis: 'x',
            },
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "hour",
                        tooltipFormat: 'DD/MM/YYYY HH:mm'
                    },
                    title: {
                        display: true
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    },
                    min: 600,
                    suggestedMax: 800,
                }
            }
        },
    };
    
    return new ChartComponent(chartConfig, {
        height: "auto",
        width: "auto",
    }, {
        parent: parent,
        style: {
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            bottom: "0",
        }
    });
}


function createTempCoolerChart({
    parent, 
    style = {
        margin: "2em 1em 1em 1em",
    }
}) {

    let dp = {};
    let yesterday = (new Date(Date.now() - (864e5/2))).setSeconds(0,0);
    let current = new Date().setSeconds(0,0);
    dp[new Date(yesterday).toISOString()] = 0;
    dp[new Date(current).toISOString()] = 0;

    const labels = Object.keys(dp).map(v => new Date(v));
    const datapoints = Object.values(dp);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Cool Top IN Temp.',
            data: datapoints,
            borderColor: "rgba(100,100,255,.5)",
            backgroundColor: "rgba(100,100,255,0)",
            pointRadius: 1,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        }, {
            label: 'Cool Top OUT Temp.',
            data: datapoints,
            borderColor: "rgba(100,255,255,.5)",
            backgroundColor: "rgba(100,255,255,0)",
            pointRadius: 1,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        }, {
            label: 'Cool Btm IN Temp.',
            data: datapoints,
            borderColor: "rgba(255,100,255,.5)",
            backgroundColor: "rgba(255,100,255,0)",
            pointRadius: 1,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        }, {
            label: 'Cool Btm OUT Temp.',
            data: datapoints,
            borderColor: "rgba(255,255,100,.5)",
            backgroundColor: "rgba(255,255,100,0)",
            pointRadius: 1,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        }]
    };
    
    const chartConfig = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false,
                    text: ''
                },
            },
            interaction: {
                intersect: false,
                axis: 'x',
            },
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "hour",
                        tooltipFormat: 'DD/MM/YYYY HH:mm'
                    },
                    title: {
                        display: true
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    },
                    min: 20,
                    max: 40,
                }
            }
        },
    };
    
    return new ChartComponent(chartConfig, {
        height: "auto",
        width: "auto",
    }, {
        parent: parent,
        style: {
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            bottom: "0",
        }
    });
}


function setChart(chart, labels, datapoints) {
    // console.log("updating chart...", chart, labels, datapoints);
    chart.chart.data.labels = labels;
    datapoints.forEach((data, dataidx) => {
        chart.chart.data.datasets[dataidx].data = data;
    });
    chart.chart.update();
}