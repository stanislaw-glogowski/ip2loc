# Unofficial [IP2Location](http://www.ip2location.com/)  Node.js module.

## Installation

    npm install ip2loc

## Basic usage

    var ip2loc = new (require('ip2loc'))({
        paths : {
            ipv4 : <path to IPv4 database>,
            ipv6 : <path to IPv6 database>
        },
        fakeIps : null // array of fake ips
    });

    console.log(ip2location.query(<ip>));

You can get sample database on
[http://www.ip2location.com/developers/nodejs](http://www.ip2location.com/developers/nodejs)

## License

[MIT](https://github.com/stanislaw-glogowski/node-ip2loc/blob/master/LICENSE)
