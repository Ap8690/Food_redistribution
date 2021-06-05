const IPFS = require('ipfs-api');
const ipfs = new IPFS({host: 'ipfs.infura', port: 5001, protocol: 'https'});

export default ipfs;