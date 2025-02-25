import { Application } from "@hotwired/stimulus";

const application = Application.start();

const modules = import.meta.glob("./**/*_controller.js");

for (const path in modules) {
    modules[path]().then((module) => {
        // Extract the controller name correctly
        const controllerName = path
            .replace("./", "") // Remove leading ./
            .replace("_controller.js", "") // Remove _controller.js suffix
            .replace(/\//g, "--") // Convert folder structure to Stimulus format
            .replace(/_/g, "-"); // Convert underscores to dashes for multi-word controllers

        application.register(controllerName, module.default);
    });
}
