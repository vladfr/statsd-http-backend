statsd-hummingbird-backend
===================

Emits data to a HTTP backend via GET request, to use with [Hummingbird](https://github.com/mnutt/hummingbird) dashboard

installation
============

   npm install statsd-hummingbird-backend

usage
=====

In config.js:

```
{
backends: [ "statsd-graphite-http-backend" ],
bridgeURL: 'http://HUMM_TRACKER:HTTP_PORT/tracking_pixel.gif'
}
```
