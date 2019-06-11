# Dynamic Iptables

Dynamic Iptables is a Node.js module and CLI tool that generate iptables rules by DNS names.

## Installation

```sh
> npm install dynamic-iptables --save
```

or for CLI

```sh
> npm install -g dynamic-iptables
```

## CLI

### Getting help

 ```sh
> dynamic-iptables --help

# Usage: dynamic-iptables [options]
# 
# Options:
#  -V, --version          output the version number
#  -m, --multiport        add multiport to iptables command
#  -c, --chain <chain>    defines chain to apply rules
#  -r, --recreate-chain   remove and create chain
#  -p, --proto <proto>    defines protocol tcp|udp
#  --dport <dport>        defines dport
#  -s, --source <source>  defines source to rules
#  -j, --target <target>  defines target to ACCEPT|DROP|REJECT|RETURN
#  -h, --help             output usage information
 ```

### Generating rules

 ```sh
> dynamic-iptables -s 192.168.1.1 -p tcp -m --dport 80,443 -j ACCEPT github.com
# iptables -I FORWARD -s 192.168.1.1 -d 192.30.253.112 -p tcp -m multiport --dport 80,443 -j ACCEPT
 ```

## API

### Generating new chain and rules

 ```javascript
 const DynIptables = require('dynamic-iptables')

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

# iptables -X dyn-iptables
# iptables -N dyn-iptables
# iptables -I dyn-iptables -s 192.168.3.0/24 -d 104.16.21.35 -p tcp -m multiport --dport 80,443 -j ACCEPT
# iptables -I dyn-iptables -s 192.168.3.0/24 -d 104.16.25.35 -p tcp -m multiport --dport 80,443 -j ACCEPT
# iptables -I dyn-iptables -s 192.168.3.0/24 -d 104.16.17.35 -p tcp -m multiport --dport 80,443 -j ACCEPT
# iptables -I dyn-iptables -s 192.168.3.0/24 -d 104.16.23.35 -p tcp -m multiport --dport 80,443 -j ACCEPT
# iptables -I dyn-iptables -s 192.168.3.0/24 -d 104.16.27.35 -p tcp -m multiport --dport 80,443 -j ACCEPT
# ...
 ```