var _        = require('underscore'),
    net      = require('net'),
    bignum   = require('bignum'),
    Database = require('./ip2loc/database');

/**
 * Ip2Loc
 * @param options
 * @constructor
 */
var Ip2Loc = function(options) {
    this.options = _.defaults({}, options || {}, {
        paths : {
            ipv4 : null,
            ipv6 : null
        },
        fakeIps : null
    });

    this.bins = {};

    _.each(Database.types, function(value, key) {
        this.bins[value] = new Database({
            path : this.options.paths[key],
            type : value
        });
    }.bind(this));
}

/**
 * library version
 * @type {string}
 */
Ip2Loc.version = '0.0.1'

/**
 * positions
 * @type {object}
 */
Ip2Loc.positions = {
    country              : [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    region               : [0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    zip_code             : [0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 7, 7, 7, 0, 7, 0, 7, 7, 7, 0, 7],
    city                 : [0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    time_zone            : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 7, 8, 8, 8, 7, 8, 0, 8, 8, 8, 0, 8],
    latitude             : [0, 0, 0, 0, 0, 5, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    longitude            : [0, 0, 0, 0, 0, 6, 6, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    isp                  : [0, 0, 3, 0, 5, 0, 7, 5, 7, 0, 8, 0, 9, 0, 9, 0, 9, 0, 9, 7, 9, 0, 9, 7, 9],
    domain               : [0, 0, 0, 0, 0, 0, 0, 6, 8, 0, 9, 0, 10, 0, 10, 0, 10, 0, 10, 8, 10, 0, 10, 8, 10],
    net_speed            : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 11, 0, 11, 8, 11, 0, 11, 0, 11, 0, 11],
    idd_code             : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 12, 0, 12, 0, 12, 9, 12, 0, 12],
    area_code            : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 13, 0, 13, 0, 13, 10, 13, 0, 13],
    weather_station_code : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 14, 0, 14, 0, 14, 0, 14],
    weather_station_name : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 15, 0, 15, 0, 15, 0, 15],
    mcc                  : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 16, 0, 16, 9, 16],
    mnc                  : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 17, 0, 17, 10, 17],
    mobile_brand         : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 18, 0, 18, 11, 18],
    elevation            : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 19, 0, 19],
    usage_type           : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 20]
}

_.extend(Ip2Loc.prototype, {

    /**
     * process fake ips
     * @param ip
     * @returns {*}
     */
    processFakeIps : function(ip) {
        var ips = this.options.fakeIps;
        if (_.isArray(ips) && ips.length > 0) {
            ip = ips[Math.floor(Math.random() * ips.length)];
        }
        return ip;
    },

    /**
     * query
     * @param ip
     * @returns {{}}
     */
    query : function(ip) {
        ip = this.processFakeIps(ip);

        var result   = null,
            type     = net.isIP(ip),
            ipNumber = false;

        switch (type) {

            case Database.types.ipv4:
                ipNumber = this.ipv42num(ip);
                break;

            case Database.types.ipv6:
                ipNumber = this.ipv62num(ip);
                break;
        }

        if (ipNumber) {

            var result = { ip : ip },
                bin    = this.bins[type],
                low    = 0,
                mid    = 0,
                high   = bin.get('count'),
                rowOffset,
                rowOffsetTo,
                ipNumberFrom,
                ipNumberTo;

            /**
             * get position
             * @param name
             * @returns {*}
             */
            var getPosition = function(name) {
                var type = bin.get('type');
                return !_.isUndefined(Ip2Loc.positions[name][type]) ?
                    Ip2Loc.positions[name][type] :
                    false;
            };

            /**
             * set result
             * @param key
             * @param value
             */
            var setResult = function(key, value) {
                if (value) {
                    result[key] = value;
                }
            };

            while (low <= high) {

                mid = parseInt((low + high) / 2);

                switch (type) {

                    case Database.types.ipv4:
                        rowOffset   = bin.get('base_address') + (mid * bin.get('column') * 4); // 4 bytes in each column
                        rowOffsetTo = bin.get('base_address') + ((mid + 1) * bin.get('column') * 4); // 4 bytes in each column
                        break;

                    case Database.types.ipv6:
                        rowOffset   = bin.get('base_address') + (mid * (16 + ((bin.get('column') - 1) * 4))); // IPFrom is 16 bytes, the rest 4 bytes
                        rowOffsetTo = bin.get('base_address') + ((mid + 1) * (16 + ((bin.get('column') - 1) * 4))); // IPFrom is 16 bytes, the rest 4 bytes
                        break;
                }

                ipNumberFrom = bin.read32or128(rowOffset);
                ipNumberTo   = bin.read32or128(rowOffsetTo);

                if (
                    _.isNull(ipNumberFrom) ||
                    _.isNull(ipNumberTo)
                ) {
                    break;
                }

                if (
                    ipNumberFrom.le(ipNumber) &&
                    ipNumberTo.gt(ipNumber)
                ) {
                    if (type == Database.types.ipv6) {
                        rowOffset += 12;
                    }

                    _.each(_.keys(Ip2Loc.positions), function(key) {

                        switch (key) {

                        /**
                         * country
                         */
                            case 'country':
                                if (getPosition(key)) {
                                    setResult('country_short', bin.readString(
                                        bin.read32(
                                            rowOffset + 4 * (getPosition(key) - 1),
                                            false
                                        )
                                    ));
                                    setResult('country_long', bin.readString(
                                        bin.read32(
                                            rowOffset + 4 * (getPosition(key) - 1),
                                            false
                                        ) + 3
                                    ));
                                }
                                break;

                        /**
                         * latitude and longitude
                         */
                            case 'latitude':
                            case 'longitude':
                                if (getPosition(key)) {
                                    setResult(key, bin.readFloat(
                                        rowOffset + 4 * (getPosition(key) - 1)
                                    ));
                                }
                                break;

                        /**
                         * time zone
                         */
                            case 'time_zone':
                                if (getPosition(key)) {
                                    var timeZone= bin.readString(
                                        bin.read32(
                                            rowOffset + 4 * (getPosition(key) - 1),
                                            false
                                        )
                                    );

                                    if (_.isString(timeZone)) {
                                        timeZone = timeZone.split(':');
                                        if (timeZone.length == 2) {
                                            setResult(key, parseInt(timeZone[0]) * 60 + parseInt(timeZone[1]));
                                        }
                                    }
                                }
                                break;

                        /**
                         * others
                         */
                            default:
                                if (getPosition(key)) {
                                    setResult(key, bin.readString(
                                        bin.read32(
                                            rowOffset + 4 * (getPosition(key) - 1),
                                            false
                                        )
                                    ));
                                }
                        }
                    });

                    break;
                } else {
                    if (ipNumberFrom.gt(ipNumber)) {
                        high = mid - 1;
                    } else {
                        low = mid + 1;
                    }
                }
            }
        }

        return result;
    },

    /**
     * ip v4 to number
     * @param ip
     * @returns {number}
     */
    ipv42num : function(ip) {
        var d = ip.split('.');
        return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
    },

    /**
     * ip v6 to number
     * @param ip
     * @returns {*|exports}
     */
    ipv62num : function(ip) {
        var maxSections = 8,
            sectionBits = 16,
            m           = ip.split('::'),
            result      = bignum('0'),
            array;

        switch (m.length) {

            case 1:
                array = m[0].split(':');
                _.each(array, function(el, index) {
                    result = result.add(bignum(parseInt('0x' + el).toString()).shiftLeft((maxSections - (index + 1)) * sectionBits));
                });
                break;

            case 2:
                array = m[0].split(':');
                _.each(array, function(el, index) {
                    result = result.add(bignum(parseInt('0x' + el).toString()).shiftLeft((maxSections - (index + 1)) * sectionBits));
                })
                array = m[1].split(':');
                _.each(array, function(el, index) {
                    result = result.add(bignum(parseInt('0x' + el).toString()).shiftLeft((array.length - (index + 1)) * sectionBits));
                });
                break;
        }
        return result;
    }
});


/**
 * expose Ip2Loc
 * @type {*}
 */
module.exports = Ip2Loc;
