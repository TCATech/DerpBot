module.exports = {
	name: 'daily',
	run: async(client, message, args) => {
		const Coins = Math.floor(Math.random() * (3000))
		client.schema.findOne({ User: message.author.id }, async(err, data) => {
			if(err) client.logger.error(err)
			if(data && data.DailyTime && Date.now() < data.DailyTime) return message.channel.send(client.embed({ title: 'Mate, slow down!', description: `You can get your daily coins again in **${client.ms(data.DailyTime - Date.now(), { long: true })}**.` }, message))
			if(data) {
				data.Coins += Coins
				data.DailyTime = Date.now() + client.ms('1d')
				data.save()
				return message.channel.send(client.embed({ title: `Here are your daily coins, ${message.author.username}`, description: `I have given you ${client.derpcoin} **${Coins}**!` }, message))
			} else {
				data = new client.schema({ User: message.author.id, Coins, DailyTime: Date.now() + client.ms('1d') })
				data.save()
				return message.channel.send(client.embed({ title: `Here are your daily coins, ${message.author.username}`, description: `I have given you ${client.derpcoin} **${Coins}**!` }, message))
			}
		})
	}
}