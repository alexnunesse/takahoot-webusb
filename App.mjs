import { el, mount, list } from "./node_modules/redom/dist/redom.es.js";
import WebUSBService from "./WebUSBService.js";
import KahootSession from "./kahoot-service/KahootSession.js";
import Target from "./vues/Target.js";

const webUSBService = new WebUSBService();

window.onload = () => {
    document.querySelector("#usb-connect").onclick = () => {
        webUSBService.configureNewDevices().then(() => webUSBService.connect);
    };

    webUSBService.getDevices()
        .then(devices =>
            webUSBService.connect().then(() => {
                devices.forEach((d, i) => {
                        mount(document.getElementById("el"),
                            new Target(webUSBService, "Target " + (i + 1)));
                    });
                })
        );
};

//TODO Kahoot stuff
/*let sessions = [
  new KahootSession("3865981", "Gérard", 1)
];

sessions[0].joinPromise().then(() => {
    console.info("Gérard joined kahoot !")
});*/

