export default class KeyStatesConsumer {
    static #keyStates
    static #consumers = []
    static registerKeyStates(keyStates) {
        this.#keyStates = keyStates;
    }

    /**
     * <p>Register a key input handler. The handler sequence is ordered in their registering order, which means previous registered handler has higher priority compared to later one.
     * <p>When #consumes is invoked, all the registered handlers will be invoked. Every handler checks if its corresponding key is pressed, if pressed, handler will execute and if shouldPassed of the executed handler is false, all the low-priority handler won't be invoked.
     * @param key - The key to register
     * @param handler - The function will be invoked if the registered key is pressed when KeyStatesConsumer#consumes
     * @param shouldPassed - If false, the event will not be caught by low priority handler
     */
    static registerConsumer(key, handler, shouldPassed) {
        this.#consumers.push({key: key, handler: handler, shouldPassed: shouldPassed});
        return this;
    }

    static consumes() {
        let anyKeyPressed = false;
        for (const consumer of this.#consumers) {
            if (this.#checkKeyPressed(consumer)) {
                consumer.handler();
                anyKeyPressed = true;
                if (!consumer.shouldPassed) {
                    break;
                }
            }
        }
        if (!anyKeyPressed) {
            this.#consumesDefault();
        }
    }

    static #checkKeyPressed(consumer) {
        if (consumer.key === "") return false;
        return this.#keyStates[consumer.key].pressed;
    }

    static #consumesDefault() {
        this.#findDefaultConsumer().handler();
    }

    static #findDefaultConsumer() {
        return this.#consumers.find(value => value.key === "")
    }
}