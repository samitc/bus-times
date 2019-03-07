export default class Service {
    constructor() {
        this.callbacks = []
    }
    addCallback(callback) {
        this.callbacks.push(callback)
    }
    removeCallback(callback) {
        var index = this.callbacks.indexOf(callback)
        if (index > -1) {
            this.callbacks.splice(index, 1)
        }
    }
    onChanged(val) {
        for (let callback of this.callbacks) {
            callback(val)
        }
    }
}