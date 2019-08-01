#!/usr/bin/env node
const DynIptables = require('./index')
const program = require('commander')

program.version('0.1.0')

program
  .option('-m, --multiport', 'add multiport to iptables command')
  .option('-c, --chain <chain>', 'defines chain to apply rules')
  .option('-r, --recreate-chain', 'remove and create chain')
  .option('-p, --proto <proto>', 'defines protocol tcp|udp')
  .option('--dport <dport>', 'defines dport')
  .option('-s, --source <source>', 'defines source to rules')
  .option('-j, --target <target>', 'defines target to ACCEPT|DROP|REJECT|RETURN')

program.parse(process.argv)

const cmdOpts = program.opts()
const options = {}
if (cmdOpts['multiport']) options['multiport'] = true
if (cmdOpts['chain']) options['chain'] = cmdOpts['chain']
if (cmdOpts['proto']) options['proto'] = cmdOpts['proto']
if (cmdOpts['source']) options['source'] = cmdOpts['source']
if (cmdOpts['target']) options['target'] = cmdOpts['target']
if (cmdOpts['dport']) options['dport'] = cmdOpts['dport']

if (options.chain && cmdOpts.recreateChain) {
  const remove = DynIptables.removeChain(options['chain'])
  const create = DynIptables.createChain(options['chain'])
  console.log(remove)
  console.log(create)
}

DynIptables.resolveDnsName(process.argv[process.argv.length - 1], (err, res) => {
  if (err) return console.log(err)
  DynIptables.createIptablesRule(res, options, (err, rules) => {
    if (err) return console.log(err)
    return rules.map((rule) => {
      return console.log(`${rule}\r`)
    })
  })
})
