class Storage {

    get(key) {
        let JSONString = localStorage.getItem(key);
        if (JSONString != null) {
            return JSON.parse(JSONString);
        } else {
            return null;
        }
    }

    remove(key) {
        localStorage.removeItem(key);
        }

    set(key, obj) {
        localStorage.setItem(key, JSON.stringify(obj));
    }

    has(key) {
        return !!this.get(key);
    }

}

var storage = new Storage();
export default storage;
