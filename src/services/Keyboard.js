import Service from "./Service";

export default class Keyboard extends Service {
    constructor() {
        super()
        this.keyboard = false
    }
    hasKeyboard() {
        return this.keyboard
    }
    setHasKeyboard(hasKeyboard) {
        if (hasKeyboard !== this.keyboard) {
            super.onChanged(hasKeyboard)
            this.keyboard = hasKeyboard
        }
    }
}