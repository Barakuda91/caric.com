 class Includer{
    constructor(name) {
        this.data = {};
    }

    get(name) {
        if (this.data[name]) return this.data[name];
        else return null;
    }

    set(name, module) {
        this.data[name] = module;
        return module;
    }
}
module.exports = new Includer();