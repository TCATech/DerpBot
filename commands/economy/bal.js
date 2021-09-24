module.exports = {
    name: 'bal',
    aliases: ['balance'],
    run: async(client, message, args) => {
        const user = message.mentions.members.first() || message.guild.members.cache.get(user => user.id === args[0]) || message.member

        message.channel.send(client.embed({ title: `${user.user.username}'s Balance` , description: `${client.derpcoin} **${await client.economy.getBal(user.id)}**` }, message))
    },
}