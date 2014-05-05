## IP2Loc

Unofficial [IP2Location](http://www.ip2location.com/)  Node.js module

### Installation

    $ npm install ip2loc

### Basic usage

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

### License

(The MIT License)

Copyright (c) 2014 Stanislaw Glogowski

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

