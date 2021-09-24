const { names, nobeg } = require('../../config/economy')

module.exports = {
    name: 'beg',
    run: async(client, message, args) => {
        const Coins = Math.floor(Math.random() * (350))
        const Name = names[Math.floor(Math.random() * names.length)]
        const nou = nobeg[Math.floor(Math.random() * nobeg.length)]

        const allowedToBeg = Math.floor(Math.random() * 100) > 50
        if(!allowedToBeg) return message.channel.send(client.embed({ title: Name, description: `"${nou}"` }, message))

        client.economy.addBal(message.author.id, Coins)
        return message.channel.send(client.embed({ title: Name, description: `"Awwww you poor little beggar, take ${client.derpcoin} **${Coins}**."` }, message))
    },
    timeout: 30000
}