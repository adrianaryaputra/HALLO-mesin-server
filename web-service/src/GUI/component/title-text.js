import BasicComponent from './basic-component.js';
export default class TitleText extends BasicComponent{

    constructor(value, options) {
        super(options);
        this.value = value;
        this.draw();
    }

    draw() {

        // set holder style
        this.stylize(this.element(), {
            margin: "auto 0"
        });

        this.elem.value = document.createElement("h3");
        this.element().appendChild(this.elem.value);
        this.setValue(this.value)
        this.stylize(this.elem.value, {
        });
    }

    setValue(val) {
        this.elem.value.innerText = val;
    }

}