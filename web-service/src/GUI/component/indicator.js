import BasicComponent from './basic-component.js';
export default class Indicator extends BasicComponent{

    constructor({
        valueON, 
        valueOFF, 
        colorON = "var(--color-state-normal)", 
        colorOFF = "var(--color-state-danger)"
    }, options
    ) {
        super(options);
        this.valueON  = valueON;
        this.valueOFF = valueOFF;
        this.colorON  = colorON;
        this.colorOFF = colorOFF;
        this.draw();
    }

    draw() {

        // set holder style
        this.stylize(this.element(), {
        });

        this.elem.value = document.createElement("h3");
        this.element().appendChild(this.elem.value);
        this.elem.value.innerText = "###";
        this.stylize(this.element(), {
            backgroundColor: this.colorOFF,
            borderRadius: "var(--small)",
            textAlign: "center",
        });
    }

    toggle(logic) {
        if(logic) {
            this.elem.value.innerText = this.valueON;
            this.stylize(this.element(), { backgroundColor: this.colorON });
        } else {
            this.elem.value.innerText = this.valueOFF;
            this.stylize(this.element(), { backgroundColor: this.colorOFF });
        }
    }

}