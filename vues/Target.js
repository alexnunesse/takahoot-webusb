import { el } from "/node_modules/redom/dist/redom.es.js";
import TargetActions from "./TargetActions.js";
import BumperActions from "./BumperActions.js";

export default class Target {
    constructor(webUSBService, targetName) {
        this.el = el(".tile.is-parent.is-vertical",
            [
                el("h1.title", targetName),
                [
                    new TargetActions(webUSBService),
                    el(".tile",
                        [
                            el(".tile.is-parent.is-vertical",
                                [
                                    el("article.tile.is-child.notification.is-danger.box",
                                        [
                                            new BumperActions(webUSBService)
                                        ]
                                    ),
                                    el("article.tile.is-child.notification.is-warning.box",
                                        [
                                            new BumperActions(webUSBService)
                                        ]
                                    ),
                                ]
                            ),
                            el(".tile.is-parent.is-vertical",
                                [
                                    el("article.tile.is-child.notification.is-info.box",
                                        [
                                            new BumperActions(webUSBService)
                                        ]
                                    ),
                                    el("article.tile.is-child.notification.is-success.box",
                                        [
                                            new BumperActions(webUSBService)
                                        ]
                                    ),
                                ]
                            )
                        ])
                ]
            ]
        );
    }
}