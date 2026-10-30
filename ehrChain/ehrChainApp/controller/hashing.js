// The EHR contract stores only hashes (bytes32). The microservice receives the
// plain values and converts each one with SHA-256, the same algorithm the
// off-chain EHR (MySQL) uses, so both sides can compare the same hash.
var crypto = require('crypto');
var initializer = {};

// "texto" -> "0x" + 64 hex characters (32 bytes = bytes32)
initializer.toBytes32 = function (value) {
    return "0x" + crypto.createHash('sha256').update(String(value), 'utf8').digest('hex');
}

// Hashes the four fields of a health record in the order the contract expects
initializer.hashRecord = function (id, title, section, details) {
    return {
        idH: initializer.toBytes32(id),
        titleH: initializer.toBytes32(title),
        sectionH: initializer.toBytes32(section),
        detailsH: initializer.toBytes32(details)
    };
}

module.exports = initializer;
