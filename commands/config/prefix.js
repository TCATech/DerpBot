const prefixSchema = require('../../schemas/prefix')

module.exports = {
    name: 'prefix',
    description: 'Change the prefix of the bot.',
    usage: '[new prefix]',
    userPerms: ['MANAGE_GUILD'],
    run: async(client, message, args) => {
        const data = await prefixSchema.findOne({
            GuildID: message.guild.id,
        })

        if (!args[0]) return message.channel.send('You must provide a **new prefix**!')
        if (args[0].length > 5) return message.channel.send('Your new prefix must be under `5` characters!')
        if(data) {
            await prefixSchema.findOneAndRemove({
                Guild: message.guild.id
            })

            if(args[0] === client.config.prefix || args[0] === "reset") {
                message.channel.send(`${client.user.username}'s prefix is now back to the default, which is \`${client.config.prefix}\`.`)

                let newData = new prefixSchema({
                    Prefix: client.config.prefix,
                    Guild: message.guild.id
                })
                return newData.save()
            }

            message.channel.send(`${client.user.username}'s prefix is now \`${args[0]}\`.`)

            let newData = new prefixSchema({
                Prefix: args[0],
                Guild: message.guild.id
            })
            newData.save()
        } else {
            message.channel.send(`${client.user.username}'s prefix is now \`${args[0]}\`.`)

            let newData = new prefixSchema({
                Prefix: args[0],
                Guild: message.guild.id
            })
            newData.save()
        }
    }
}