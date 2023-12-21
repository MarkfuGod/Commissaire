export default class KeyStates {
    static #keyStates = {}
    static registerKey(keyName) {
        this.#keyStates[keyName] = {pressed: false};
    }

}