/*
 * get-UTXO-by-address plugin for bcoin
 * USAGE:
 *   bcoin --plugins <path/to/coinbyaddr.js>
 */

'use strict';

const HTTP = require('./lib/http');
const plugin = exports;

class Plugin {
  constructor(node) {
    this.node = node;

    this.http = new HTTP(this.node);

    this.http.on('error', (err) => {
      console.log(err);
    });
  }

  async open() {
    this.http.attach('/coinbyaddr', this.node.http);
  }
}

plugin.id = 'coinbyaddr';

plugin.init = function init(node) {
  return new Plugin(node);
};
