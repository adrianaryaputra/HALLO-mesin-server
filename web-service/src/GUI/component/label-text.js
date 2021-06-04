import BasicComponent from './basic-component.js';
export default class LabelText extends BasicComponent{

    constructor({label="###", value="###", unit=""}, options) {
        super(options);
        this.label = label;
        this.value = value;
        this.unit = unit;
        this.draw();
    }

    draw() {

        // set holder style
        this.stylize(this.element(), {
            display: "grid",
            gap: ".5em",
            gridTemplateColumns: "minmax(170px,1fr) 10px minmax(150px,1fr)",
            gridAutoFlow: "row",
            // backgroundColor: "#000",
            borderRadius: ".3em",
            justifyItems: "stretch",
        });


        this.elem.label = document.createElement("h3");
        this.element().appendChild(this.elem.label);
        this.setLabel(this.label);
        this.stylize(this.elem.label, {
            margin: "auto 0",
        });

        this.elem.colon = document.createElement("h3");
        this.elem.colon.textContent = ":";
        this.element().appendChild(this.elem.colon);
        this.stylize(this.elem.colon, {
            margin: "auto 0",
            textAlign: "right"
        });


        this.valueHolder = new BasicComponent({
            parent: this.element(),
            style: {
                backgroundColor: "var(--color-background)",
                padding: ".5em",
                borderRadius: "inherit",
                display: "grid",
                gridTemplateColumns: "auto auto",
            }
        })

        this.elem.value = document.createElement("h3");
        this.valueHolder.element().appendChild(this.elem.value);
        this.setValue(this.value)
        this.stylize(this.elem.value, {
            textAlign: "left"
        });

        this.elem.unit = document.createElement("h3");
        this.valueHolder.element().appendChild(this.elem.unit);
        this.elem.unit.innerText = this.unit;
        this.stylize(this.elem.unit, {
            textAlign: "right"
        });
    }

    setValue(val) {
        this.elem.value.innerText = val;
        this.elem.value.style.after
    }

    setLabel(lbl) {
        this.elem.label.innerText = lbl;
    }

}