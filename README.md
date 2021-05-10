### Get UTXO By Address plugin for bcoin


#### Usage

Install plugin:

```
$ git clone https://github.com/pinheadmz/coinbyaddr
$ cd coinbyaddr
$ npm install
```

Run bcoin with plugin connected:

```
$ bcoin --index-tx --index-address --plugins </path/to/this/repo/coinbyaddr.js>
```

If this is the first time you have enabled the indexers, they may take a long
time to index the blockchain. You may also need to wait for your Full Node to
sync the entire blockchain to get accurate results. This plugin will not work
with a pruned node or an SPV node.

Make queries to the HTTP endpoint: `/coinbyaddr/:address`

#### Example

```
$ curl 127.0.0.1:8332/coinbyaddr/bc1qssgxyn37emr3dejxl5v49jepp68rtmcxzr52at

[
  {
    "version": 1,
    "height": 604957,
    "value": 1557626,
    "script": "00148410624e3ecec716e646fd1952cb210e8e35ef06",
    "address": "bc1qssgxyn37emr3dejxl5v49jepp68rtmcxzr52at",
    "coinbase": false,
    "hash": "cc60b852bcce21176152db91251809d47e7a2ecb94525ba3109dd1c4e530f837",
    "index": 0
  }
]
```

#### Notes on limitations

The original `coins-by-address` API had
[stability and efficiency issues](https://github.com/bcoin-org/bcoin/issues/589),
and was removed in [bcoin PR#758](https://github.com/bcoin-org/bcoin/pull/758).

The existing [`txs-by-address`](https://bcoin.io/api-docs/#get-tx-by-address)
API was refactored to paginate in batches of 100
transactions and keep resource usage low. This plugin combines that API with the
[`coins-by-outpoint`](https://bcoin.io/api-docs/#get-coin-by-outpoint) API to get
unspent TX outputs by address.

The plugin requests `txs-by-address` internally and paginates automatically
while checking for unspent outputs. When it stops getting new transactions by
paginating, it returns the array of coins. For this reason, the `cooinbyaddr`
endpoint may take a long time to return, and may return a huge amount of data.


