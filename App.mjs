import { el, mount, list } from "./node_modules/redom/dist/redom.es.js";
import WebUSBService from "./WebUSBService.js";
import KahootSession from "./kahoot-service/KahootSession.js";

class Target {
    constructor(targetName) {
        this.el = el(".container.tile.is-6.has-text-centered", el(".tile.is-parent.is-vertical",
            [
                el("h1.title", targetName),
                el(".tile",
                    [
                        el(".tile.is-parent.is-vertical",
                            [
                                el("article.tile.is-child.notification.is-danger.box", el("p.tile", "1")),
                                el("article.tile.is-child.notification.is-warning.box", el("p.tile", "2")),
                            ]
                        ),
                        el(".tile.is-parent.is-vertical",
                            [
                                el("article.tile.is-child.notification.is-info.box", el("p.tile", "3")),
                                el("article.tile.is-child.notification.is-success.box", el("p.tile", "4")),
                            ]
                        )
                    ])
            ]
        ));
    }
}

function connect() {
    port.connect().then(() => {
        port.onReceive = data => {
            console.log("Received:", bytesToPrettyHexString(data));
            document.getElementById('output').value += bytesToPrettyHexString(data);
        };
        port.onReceiveError = error => {
            console.error(error);
            document.querySelector("#connect").style = "visibility: initial";
            port.disconnect();
        };
    });
}

const webUSBService = new WebUSBService();

window.onload = () => {
    document.querySelector("#usb-connect").onclick = function () {
        webUSBService.configureNewDevices().then(() => {
            webUSBService.connect().then(() => {
                console.info("Aaaaaall gooooood !");
            })
        });
    };
};

let DOMTargets = [
    new Target("Target A"),
    new Target("Target B"),
    new Target("Target C"),
    new Target("Target D"),
];

DOMTargets.forEach(t => mount(document.body, t));

//TODO WebUSB stuff
// DOMException: Must be handling a user gesture to show a permission request.
// DOMException: Access denied.



//TODO Kahoot stuff
/*let sessions = [
  new KahootSession("3865981", "Gérard", 1)
];

sessions[0].joinPromise().then(() => {
    console.info("Gérard joined kahoot !")
});*/

