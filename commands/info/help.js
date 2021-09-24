const { MessageEmbed } = require('discord.js')
// const { MessageButton } = require('discord-buttons')
const { readdirSync } = require('fs')
const prefixModel = require('../../schemas/prefix')

module.exports = {
    name: 'help',
    description: 'Gives you some info on a command.',
    usage: '[command name/alias]',
    run: async (client, message, args) => {
      const db = await prefixModel.findOne({
        Guild: message.guild.id,
      })

      let prefix = client.config.prefix

      if(db) prefix = db.Prefix


        if(!args[0]) {
            let categories = []

            const dirEmotes = {
                info: '📰',
                moderation: '🔨',
                wip: '👨‍💻',
                fun: '⚽',
                roles: '📛',
                games: '🎮',
                config: '⚙',
                misc: '💡',
                economy: ':coin:',
            }

            readdirSync('./commands/').forEach((dir) => {
                let dirName = `${dirEmotes[dir]} ${dir.toUpperCase()}`
                if(dirEmotes[dir] === undefined) dirName = `${dir.toUpperCase()}`

                const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith('.js'))
                
                const cmds = commands.filter((command) => {
                    let file = require(`../../commands/${dir}/${command}`)
                    const hide = file.hidden || file.wip

                    return !hide
                }).map((command) => {
                    let file = require(`../../commands/${dir}/${command}`)

                    if(!file.name) return ''

                    let name = file.name.replace('.js', '')

                    return `\`${name}\``
                })

                let data = new Object()

                data = {
                    name: cmds.length === 0 ? "** **" : dirName,
                    value: cmds.length === 0 ? "** **" : cmds.join(" "),
                    inline: true,
                }

                categories.push(data)
            })

            const embed = new MessageEmbed()
            .setTitle("📬 Need help? Here's a list of my commands!")
            .addFields(categories)
            .setDescription(`Use \`${prefix}help\` followed by a command name to get additional information on a command. For example: \`${prefix}help beg\`.`)
            .setColor(message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor)
            .setFooter(`${message.author.username} | ${client.user.username}`, message.author.displayAvatarURL({ dynamic: true }))

            // const invite = new MessageButton()
            // .setLabel('Invite me to your server!')
            // .setURL('https://dsc.gg/PainBotXD')
            // .setStyle('url')
            return message.channel.send(embed, /*invite*/)
        } else {
            const command =
              client.commands.get(args[0].toLowerCase()) ||
              client.commands.find(
                (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
              )
      
            if (!command) {
              const embed = new MessageEmbed()
                .setTitle(
                  `Invalid command! Use \`${prefix}help\` for all of my commands!`
                )
                .setColor("FF0000")
              return message.channel.send(embed)
            }
      
            const embed = new MessageEmbed()
              .setTitle("Command info")
              .addField(
                "Command:",
                command.name
                  ? `\`${prefix}${command.name}\``
                  : "No name for this command."
              )
              .addField(
                "Description:",
                command.description
                  ? command.description
                  : "No description for this command."
              )
              .addField(
                "Aliases:",
                command.aliases
                  ? `\`${command.aliases.join("` `")}\``
                  : "No aliases for this command."
              )
              .addField(
                "Usage:",
                command.usage
                  ? `\`${prefix}${command.name} ${command.usage}\``
                  : `\`${prefix}${command.name}\``
              )
              .setColor(message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor)
              .setTimestamp()
            if (command.usage) {
                embed.setFooter('<> = Required | [] = Optional', message.author.displayAvatarURL({ dynamic: true }))
            } else {
              embed.setFooter(`${message.author.username} | ${client.user.username}`, message.author.displayAvatarURL({ dynamic: true }))
            }
            return message.channel.send(embed)
        }
    }
}