// EHRChain does not hash: following Protocol 3 of the paper, the EHR microservice
// computes the hashes and EHRChain only receives them. This helper only checks
// that each value has the bytes32 format the EHR contract expects.
var initializer = {};

const BYTES32 = /^0x[0-9a-fA-F]{64}$/;

// Returns true when every value is "0x" followed by 64 hexadecimal characters
initializer.areBytes32 = function (values) {
    return values.every(v => typeof v === "string" && BYTES32.test(v));
}

module.exports = initializer;
