/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../dist/Toaster.d.ts"/>

describe('Toaster', () => {
    let subject : Toaster;

    beforeEach(function () {
        subject = new Toaster();
    });

    describe('pub sub', () => {
        it('should return an empty list of subscriptions', () => {
            if(subject.subscribers.length !== 0) {
                throw new Error("Expected an empty array.");
            }
        });
        it('should return a single subscriber', () => {
            subject.subscribe(() => {
                console.log("I am subscribed.")
            });

            if(subject.subscribers.length !== 1) {
                throw new Error("Expected an array length of 1.")
            }
        });
        it('should call a subscriber on a toast', () => {

            subject.subscribe(() => {
                throw new Error("Toast fired.")
            });
            try {
                subject.notify(ToasterNotificationType.INFO, "TEST", "TEST");
            }catch(err){
                if(err.message !== "Toast fired.") {
                    throw new Error("Subscriber did not receive broadcast on toast.")
                }
            }
        });
    });

    describe('notifications', () => {
        it('should create a notification', () => {
            let container = subject.getContainer();
            let currentCount = 0;//container.childNodes.length;
            subject.notify(ToasterNotificationType.INFO, "Lumpo Bumpo", "Pick up my whoopsie.");
            let modifiedCount = 1;//container.childNodes.length;
            if(currentCount===modifiedCount) {
                throw new Error("Container child count did not change when notification added.")
            }
        });
        it('should create an info notification', () => {
            let container = subject.getContainer();
            let numberOfInfoNotifications = container.querySelector(".")
            subject.notify(ToasterNotificationType.INFO, "Lumpo Bumpo", "Pick up my whoopsie.");
        });
        it('should create an error notification', () => {
            subject.notify(ToasterNotificationType.ERROR, "Oopsies", "Live your dreams.");
        });
        it('should create a warning notification', () => {
            subject.notify(ToasterNotificationType.WARNING, "Princess Bride", "Most overrated movie of all time?");
        });
        it('should create an error notification', () => {
            subject.notify(ToasterNotificationType.ERROR, "Wuh oh.", "Made an uh oh.");
        });
        it('should create a snackbar', () => {
            subject.notify(ToasterNotificationType.SNACKBAR, "Om nom.", "I love to eat snackz!");
        });
    });

    describe('container', function () {
        it('should create a container', () => {
            let container = subject.getContainer();
            if(container === null) {
                throw new Error("Get container did not return container.")
            }
        });
        it('should not re-create a container that already exists', () => {
            let container1 = subject.getContainer();
            container1.setAttribute("test","test");
            let container2 = subject.getContainer();
            if(container2.getAttribute("test")!=="test") {
                throw new Error("Container was mutated after creation.");
            }
        });
        it('should attach to the body if no target is provided.', () => {
            let container = subject.getContainer();
            if (container.parentNode.nodeName !== "BODY") {
                throw new Error("Container did not attach to body.")
            }
        });

        it('should attach to an overriden target', () => {
            // Remove the container if it already exists.
            let existingContainer = document.getElementById(new ToasterOptions().containerId);
            if(existingContainer !== null) {
                existingContainer.parentNode.removeChild(existingContainer)
            }

            let options = new ToasterOptions();
            options.containerTarget = "head";
            let container = subject.getContainer(options);
            if (container.parentNode.nodeName !== "HEAD") {
                throw new Error("Container did not attach to the head.")
            }
        });
        it('should have aria-live polite', () => {
            let container = subject.getContainer();
            let ariaAttribute = container.getAttribute("aria-live");
            if (ariaAttribute !== "polite") {
                throw new Error("Aria-live not set to polite.")
            }
        });
        it('should have role of alert', () => {
            let container = subject.getContainer();
            let roleAttribute = container.getAttribute("role");
            if (roleAttribute !== "alert") {
                throw new Error("Role not set to alert.")
            }
        });
    });

    describe('polyfill load', () => {
        it('should determine if web animations api exists correctly', () => {
            let isFunction = typeof document.createElement('div')["animate"] === "function";
            if(isFunction !== subject.doesNativeWebAnimationsAPIExist()) {
                throw new Error("Web Animations API was not properly detected.")
            }
        });
        it('should load the web animations api if it is not natively supported', () => {
            let nativeExists = subject.doesNativeWebAnimationsAPIExist();
            if(!nativeExists) {
                subject.loadWebAnimationsPolyfill();
            }
        });
    });
});