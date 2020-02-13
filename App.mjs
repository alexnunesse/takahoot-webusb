import { el, mount, list } from "./node_modules/redom/dist/redom.es.js";
import WebUSBService from "./WebUSBService.js";
import KahootSession from "./kahoot-service/KahootSession.js";
import Target from "./vues/Target.js";

window.onload = () => {
    document.querySelector("#usb-connect").onclick = () => {
        WebUSBService.configureNewDevices().then(() => WebUSBService.connect);
    };

    WebUSBService.getDevices()
        .then(devices =>
            WebUSBService.connect().then(() => {
                devices.forEach((d, i) => {
                        mount(document.getElementById("el"),
                            new Target(i));
                    });
                })
        );
};

