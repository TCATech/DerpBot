module.exports = {
    name: 'ping',
    run: async(client, message, args) => {
        const msg = await message.channel.send('Pinging...')
        await msg.edit(client.embed({ title: 'Pong! 🏓', description: `**Message edit:** ${msg.createdAt - message.createdAt}\n**WS:** ${client.ws.ping}\n**Uptime:** ${client.ms(client.uptime)}` }, message))
    },
    timeout: 10 * 1000
}