# IP2Loc

Unofficial [IP2Location](http://www.ip2location.com/)  Node.js module

### Installation
```bash
$ npm install ip2loc
```

### Basic usage
```javascript
var ip2loc = new (require('ip2loc'))({
    paths : {
        ipv4 : <path to IPv4 database>,
        ipv6 : <path to IPv6 database>
    },
    fakeIps : null // array of fake ips
});

console.log(ip2loc.query(<ip>));
```

You can get sample database on
[http://www.ip2location.com/developers/nodejs](http://www.ip2location.com/developers/nodejs)

## License

The MIT License
