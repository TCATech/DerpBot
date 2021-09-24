module.exports = {
    name: 'work',
    run: async(client, message, args) => {
        const Jobs = ['Programmer', 'YouTuber', 'Discord Moderator', 'Google Employee', 'Teacher', 'Game Developer', 'Twitch Streamer', 'Police Officer', 'Pro Gamer']
        const Job = Jobs[Math.floor(Math.random() * (Jobs.length))]
        const Coins = Math.floor(Math.random() * (300))
        client.economy.addBal(message.author.id, Coins)
        message.channel.send(client.embed({ title: 'Woo hoo!', description: `You worked as a ${Job} and got ${client.derpcoin} ${Coins}.` }, message))
    },
    timeout: 3600000,
}