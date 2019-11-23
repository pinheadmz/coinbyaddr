'use strict';

const {Server} = require('bweb');
const Validator = require('bval');
const {Address} = require('bcoin');

class HTTP extends Server {
  constructor(node) {
    super();
    this.node = node;
    this.initRouter();
  }

  initRouter() {
    this.use(this.router());

    // Get a coins by a certain address
    this.get('/:address', async (req, res) => {
      // Get all tx for this address
      const valid = Validator.fromRequest(req);
      const address = valid.str('address');
      const limit = valid.uint('limit', 100);
      const reverse = valid.bool('reverse', false);
      const after = valid.brhash('after', null);

      enforce(address, 'Address is required.');
      enforce(!this.node.chain.options.spv, 'Cannot get TX in SPV mode.');
      enforce(limit <= 100, 'Limit above max of 100.');

      const addr = Address.fromString(address, this.network);

      const metas = await this.node.getMetaByAddress(
        addr, {limit, reverse, after});

      // Find outputs in each TX for this address
      const coins = [];
      for (const meta of metas) {
        const tx = meta.tx;

        for (let i = 0; i < tx.outputs.length; i++) {
          const output = tx.outputs[i];

          if (!output.getAddress())
            continue;

          if (!output.getAddress().equals(addr))
            continue;

          // Check if this output is still unspent
          const coin = await this.node.getCoin(tx.hash(), i);

          if (!coin)
            continue;

          coins.push(coin);
        }
      }

      res.json(200, coins);
    });
  }
}

/*
 * Helpers
 */

function enforce(value, msg) {
  if (!value) {
    const err = new Error(msg);
    err.statusCode = 400;
    throw err;
  }
}

/*
 * Expose
 */

module.exports = HTTP;
