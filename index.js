const dns = require('dns')

module.exports = {
  resolveDnsName,
  createChain,
  removeChain,
  createIptablesRule
}

function resolveDnsName (hostname, callback) {
  dns.resolve4(hostname, (err, res) => {
    if (typeof callback === 'function') callback(err, res)
  })
}

function createIptablesRule (addresses, options, callback) {
  if (typeof addresses === 'string') addresses = [addresses]
  const rules = []
  addresses.map((address) => {
    let validOptions = validateOptions(options)
    let chain = (typeof validOptions.chain === 'string') ? `${validOptions.chain}` : 'FORWARD'
    let source = (typeof validOptions.source === 'string') ? `-s ${validOptions.source}` : ''
    let proto = (typeof validOptions.proto === 'string') ? `-p ${validOptions.proto}` : ''
    let dport = (typeof validOptions.dport === 'string') ? `--dport ${validOptions.dport}` : ''
    let target = (typeof validOptions.target === 'string') ? `-j ${validOptions.target}` : ''
    let multiport = (validOptions.multiport === true || validOptions.multiport === 'true') ? `-m multiport` : ''
    rules.push(`iptables -I ${chain} ${source} -d ${address} ${proto} ${multiport} ${dport} ${target}`)
  })
  callback(null, rules)
}

function createChain (name) {
  return `iptables -N ${name}`
}

function removeChain (name) {
  return `iptables -X ${name}`
}

// PRIVATE

function validateOptions (options) {
  return options
}
