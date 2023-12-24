export default class SaveHandler {

    #player
    #enemyList
    #camera
    #storage

    constructor(player, enemyList, camera) {
        this.#player = player;
        this.#enemyList = enemyList;
        this.#camera = camera;
        this.#storage = window.localStorage
    }

    save() {
        this.#player.saveData();
        for (let enemy of this.#enemyList) {
            enemy.saveData()
        }
        this.setStorage("camera", this.#camera)
    }

    load() {
        this.#player.loadData()
        for (let enemy of this.#enemyList) {
            enemy.loadData()
        }
        Object.assign(this.#camera, this.getStorage("camera"))
    }

    toJson(object) {
        return JSON.stringify(object);
    }

    toObject(json) {
        return JSON.parse(json);
    }

    setStorage(key, object) {
        let storage = window.localStorage;
        storage.setItem(key, this.toJson(object))
    }

    getStorage(key) {
        let storage = window.localStorage;
        return this.toObject(storage.getItem(key))
    }

}