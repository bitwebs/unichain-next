const Unichain = require('../../')
const ram = require('random-access-memory')

module.exports = {
  async create (...args) {
    const chain = new Unichain(ram, ...args)
    await chain.ready()
    return chain
  },

  replicate (a, b, t) {
    const s1 = a.replicate(true, { keepAlive: false })
    const s2 = b.replicate(false, { keepAlive: false })
    s1.on('error', err => t.comment(`replication stream error (initiator): ${err}`))
    s2.on('error', err => t.comment(`replication stream error (responder): ${err}`))
    s1.pipe(s2).pipe(s1)
    return [s1, s2]
  },

  async eventFlush () {
    await new Promise(resolve => setImmediate(resolve))
  }
}
