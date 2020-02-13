import { el } from "/node_modules/redom/dist/redom.es.js";

export default class TargetActions {
    constructor(webUSBService) {
        this.el = el("p.buttons",
            [
                this.connect = el("button.button", { title: "Connect" },
                    el("span.icon.is-small",
                        el("i.fas.fa-link")
                    )
                ),
                this.calibrate = el("button.button", { title: "Calibrate" },
                    el("span.icon.is-small",
                        el("i.fas.fa-thermometer-half")
                    )
                ),
                this.disable = el("button.button", { title: "Disable & blink" },
                    el("span.icon.is-small",
                        el("i.fas.fa-unlink")
                    )
                ),
                this.getState = el("button.button", { title: "Get state" },
                    el("span.icon.is-small",
                        el("i.fas.fa-redo")
                    )
                ),
                this.reset = el("button.button", { title: "Reset" },
                    el("span.icon.is-small",
                        el("i.fas.fa-power-off")
                    )
                )
            ]
        );

        this.connect.onclick = evt => {
            console.info('Connect target !')
        };

        this.calibrate.onclick = evt => {
            console.info('Calibrate target !')
        };

        this.disable.onclick = evt => {
            console.info('Disable target !')
        };

        this.getState.onclick = evt => {
            console.info('Get target state !');
            webUSBService.send(0, "38")
                .then(webUSBService.read)
                .catch(e => {
                    console.error("ERROR: " + e)
                });
        };

        this.reset.onclick = evt => {
            console.info('Reset target !')
        }
    }
}