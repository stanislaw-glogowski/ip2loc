var _      = require('lodash'),
    fs     = require('fs'),
    bignum = require('bignum');

/**
 * Database
 * @param options
 * @constructor
 */
var Database = function(options) {
    this.options = _.defaults({}, options || {}, {
        path : null,
        type : null
    })

    this.file = null;
    this.data = {};

    this.open();
    this.set('type', this.read8(1));
    this.set('column', this.read8(2));
    this.set('year', this.read8(3));
    this.set('month', this.read8(4));
    this.set('day', this.read8(5));
    this.set('count', this.read32(6, false));
    this.set('base_address', this.read32(10, false));
};

/**
 * types
 * @type {object}
 */
Database.types = {
    ipv4 : 4,
    ipv6 : 6
};

_.extend(Database.prototype, {

    /**
     * set to register
     * @param key
     * @param value
     * @returns {Database}
     */
    set : function(key, value) {
        this.data[key] = value;
        return this;
    },

    /**
     * get from register
     * @param key
     * @returns {*}
     */
    get : function(key) {
        return !_.isUndefined(this.data[key]) ? this.data[key] : null;
    },

    /**
     * open
     */
    open : function() {
        if (_.isNull(this.file)) {
            if (this.options.path && fs.existsSync(this.options.path)) {
                this.file = fs.openSync(this.options.path, 'r');
            } else {
                this.file = false;
            }
        }
    },

    /**
     * close
     */
    close : function() {
        if (this.file) {
            fs.closeSync(this.file);
        }
    },

    /**
     * read bin
     * @param readType
     * @param readBytes
     * @param readPos
     * @param isBigInt
     * @returns {*}
     */
    readBin : function(readType, readBytes, readPos, isBigInt) {
        var result = null;

        if (this.file) {
            var buffer = new Buffer(readBytes),
                totalRead = fs.readSync(this.file, buffer, 0, readBytes, readPos - 1);

            if (totalRead == readBytes) {
                switch (readType) {

                    case 'int8':
                        result = buffer.readInt8(0);
                        break;

                    case 'int32':
                        result = (isBigInt) ? bignum.fromBuffer(buffer, {
                            endian : 'small',
                            size   : 'auto'
                        }) : buffer.readUInt32LE(0);
                        break;

                    case 'float':
                        result = buffer.readFloatLE(0);
                        break;

                    case 'str':
                        result = buffer.toString('utf8');
                        break;

                    case 'int128':
                        result = bignum.fromBuffer(buffer, {endian : 'small', size : 'auto'});
                        break;
                }
            }
        }

        return result;
    },

    /**
     * read 8 bits
     * @param pos
     * @returns {*}
     */
    read8 : function(pos) {
        return this.readBin('int8', 1, pos, false);
    },

    /**
     * read 32 bits
     * @param pos
     * @param isBigInt
     * @returns {*}
     */
    read32 : function(pos, isBigInt) {
        return this.readBin('int32', 4, pos, isBigInt);
    },

    /**
     * read 32 bits float
     * @param pos
     * @returns {*}
     */
    readFloat : function(pos) {
        return this.readBin('float', 4, pos, false);
    },

    /**
     * read 32 or 128 bites
     * @param pos
     * @returns {*}
     */
    read32or128 : function(pos) {
        var result = null;
        switch (this.options.type) {

            case Database.types.ipv4:
                result = this.read32(pos, true)
                break;

            case Database.types.ipv6:
                result = this.read128(pos);
                break;
        }
        ;
        return result;
    },

    /**
     * read 128 bites
     * @param pos
     * @returns {*}
     */
    read128 : function(pos) {
        return this.readBin('int128', 16, pos, false);
    },

    /**
     * read string
     * @param pos
     * @returns {*}
     */
    readString : function(pos) {
        var readBytes = this.readBin('int8', 1, pos + 1, false),
            result = null;

        if (!_.isNull(readBytes)) {
            result = this.readBin(
                'str',
                readBytes,
                pos + 2,
                false
            );
        }

        // fix demo data
        if (
            _.isString(result) && (
            result == '-' ||
            result == '??' ||
            (result).indexOf('BIN demo') != -1
            )
        ) {
            result = null;
        }

        return result;
    }
});

module.exports = Database;