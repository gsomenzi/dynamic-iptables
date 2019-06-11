const DynIptables = require('./index')

const remove = DynIptables.removeChain('dyn-iptables')
const create = DynIptables.createChain('dyn-iptables')

const options = {
  chain: 'dyn-iptables',
  proto: 'tcp',
  dport: '80,443',
  source: '192.168.3.0/24',
  target: 'ACCEPT',
  multiport: true
}

DynIptables.resolveDnsName('registry.npmjs.org', (err, res) => {
  if (err) return console.log(err)
  DynIptables.createIptablesRule(res, options, (err, rules) => {
    if (err) return console.log(err)
    console.log(remove)
    console.log(create)
    return rules.map((rule) => {
      return console.log(rule)
    })
  })
})
