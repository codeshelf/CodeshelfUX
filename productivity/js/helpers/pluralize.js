function pluralize(count, singular, plural) {
    if (count == 1) {
        return singular;
    }
    else {
        return plural;
    }
}

module.exports = pluralize;
