// Simple module to encrypt / decrypt strings

/**
 * Imports Node.js native module called 'crypto' that provides cryptographic functionality that
 * includes a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher,
 * sign and verify functions
 */
var crypto = require('crypto');

/**
 * Creates an object that will handle the encrypting and decrypting of string utilizing
 * default AES192 method for encryption if otherwise not specified
 * @param opts {string|object} Parameter to utilize in the conversion
 * @returns {{encrypt: encrypt, decrypt: decrypt, password: password, salt: salt}} Returns the object used in conversion
 */
module.exports = function(opts) {
  opts = opts || {};

  /**
   * Initializes set variables for usages with the crypto module
   */
  var CRYPT_METHOD = opts.method || 'aes192', // use specific method or defaults to aes192 strength encryption
      PASS = opts.password || crypto.randomBytes(256), // use specific password or defaults to 256 random bytes from required crypto
      SALT = opts.salt || crypto.randomBytes(32).toString('hex'), // use specific salt or defaults to a string 32 random bytes from required cyrpto
      encoding = opts.encoding || 'utf8', // use specific encoding or defaults to using utf8
      digestEncoding = opts.digestEncoding || 'hex'; // use specific digestEncoding or defaults to hex

  /**
   * Returns four objects: encrypt, decrypt, password, and salt
   */
  return {

      /**
       * Convert message into a fixed length hash string by creating the cipher from crypto strength method and
       * digest from the cipher and salt
       * @param message {string} Message that will be encrypted
       * @returns {string} Returns the hashed fixed length string
       */
    encrypt: function (message) {
      var cipher = crypto.createCipher(CRYPT_METHOD, PASS);
      var digest = cipher.update(message + SALT, encoding, digestEncoding);
      return digest + cipher.final(digestEncoding);
    },

    /**
     * Converts fixed length hash string into message prior to encryption by deciphering hash utilizing correct
     * crypto strength method and separating message from the salt
     * @param digest {string} Hashed fixed length
     * @returns {string} Returns the original text upon success
       */
    decrypt: function (digest) {
      var decipher = crypto.createDecipher(CRYPT_METHOD, PASS);
      var message = decipher.update(digest, digestEncoding, encoding);
      message = message + decipher.final(encoding);
      return message.substring(0, message.length - SALT.length);
    },

    /**
     * Returns a password set by the user or generated password utilizing 256 random bytes
     * @returns PASS
       */
    password: function () {
      return PASS;
    },

    /**
     * Returns a salt set by the user or generated salt utilizing 32 random bytes
     * @returns PASS
       */
    salt: function() {
      return SALT;
    }
  };
};
