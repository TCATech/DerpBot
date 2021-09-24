const { Client, Collection } = require("discord.js");

class DerpBot extends Client {
  constructor() {
    super({
      disableMentions: "everyone",
      partials: ["MESSAGE", "CHANNEL", "REACTION"],
      restTimeOffset: 0,
    });

    //Packages that we need
    this.discord = require("discord.js");
    this.fs = require("fs");
    this.path = require("path");
    this.ms = require("ms");
    this.mongoose = require("mongoose");
    this.logger = require("consola");

    this.commands = new Collection();
    this.events = new Collection();
    this.aliases = new Collection();
    this.timeouts = new Collection();

    this.config = require("../config.json");
    this.schema = this.mongoose.model('economy', new this.mongoose.Schema({
      User: String,
      Coins: Number,
			DailyTime: String
    }))
    const self = this
    this.economy = {
      async getBal(User) {
        return await self.schema.findOne({ User }).then((d) => d ? d.Coins : 0)
      },
      addBal(User, Coins) {
        return self.schema.findOne({ User }, (err, data) => {
          if(err) throw err
          if(data) {
            data.Coins += Coins
          } else {
            data = new self.schema({ User, Coins })
          }
          data.save()
        })
      }
    }

    this.derpcoin = '<:derpcoin:886426717210689646>'
  }
  commandHandler(path) {
    this.fs.readdirSync(this.path.normalize(path)).forEach((dir) => {
      const commands = this.fs
        .readdirSync(this.path.join(__dirname, '..', path, dir))
        .filter((file) => file.endsWith(".js"));

      for (let file of commands) {
        let pull = require(this.path.join(__dirname, '..', path, dir, file));
        if (pull.name && typeof pull.name === 'string') {
          this.commands.set(pull.name, pull);
          this.logger.success(`Loaded command ${file}`);
        } else {
          this.logger.info(`Failed to load command ${file}: help.name is not specified, or it's not a string.`)
          continue;
        }
        if (pull.aliases && Array.isArray(pull.aliases)) {
          pull.aliases.forEach((a) => this.aliases.set(a, pull.name))
        }
      }
    });
  }
  start(token, path) {
    this.commandHandler(path);
    this.login(token);

    this.on("ready", () => {
      this.logger.success(`Logged in as ${this.user.tag}!`);
      this.user.setActivity(this.config.activity.name, { type: this.config.activity.type.toUpperCase() })
    });

    this.mongoose.connect(process.env.mongoSRV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.mongoose.connection.on("connected", () =>
      this.logger.success("Connected to DB!")
    );

    this.on("message", async (message) => {
      const prefixSchema = require('../schemas/prefix')
      const data = await prefixSchema.findOne({
        Guild: message.guild.id
      })

      let prefix = this.config.prefix

      if(data) prefix = data.Prefix

      if (
        !message.guild ||
        message.author.bot ||
        !message.content.startsWith(prefix)
      )
        return;
      const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
      const cmd = args.shift().toLowerCase();
      const command =
        this.commands.get(cmd) || this.commands.get(this.aliases.get(cmd));
      if (!command) return;
      if (
        command.userPerms &&
        !message.member.hasPermission(command.userPerms)
      )
        return message.channel.send(
          new Discord.MessageEmbed()
            .setTitle("Oopsie Poopsie!")
            .setDescription(
              `You need the following permissions to use this command: \`${command.userPerms
                .map(
                  (value) =>
                    `${value[0].toUpperCase() +
                    value.toLowerCase().slice(1).replace(/_/gi, " ")
                    }`
                )
                .join(", ")}\``
            )
            .setColor(client.color)
            .setFooter(
              client.user.username,
              client.user.displayAvatarURL({ dynamic: true })
            )
            .setTimestamp()
      );
      if (command.timeout) {
        if (this.timeouts.has(`${command.name}${message.author.id}`))
          return message.channel.send(
            this.embed({
              title: "Mate, slow down!",
              description: `You're on a cooldown. Please wait **${this.ms(
                this.timeouts.get(`${command.name}${message.author.id}`) -
                  Date.now(),
                { long: true }
              )}** before using this command again!`,
            }, message)
          );
        command.run(this, message, args).catch((err) => this.logger.error(err))
        this.timeouts.set(`${command.name}${message.author.id}`, Date.now() + command.timeout)
        setTimeout(() => {
          this.timeouts.delete(`${command.name}${message.author.id}`)
        }, command.timeout)
      } else command.run(this, message, args).catch((err) => this.logger.error(err));
    });
  }
  embed(data, message) {
    return new this.discord.MessageEmbed({
      ...data,
      color:
        message.guild.me.displayHexColor === "#000000"
          ? "#ffffff"
          : message.guild.me.displayHexColor,
    }).setFooter(
      `${message.author.tag} | ${this.user.username}`,
      message.author.displayAvatarURL({ dynamic: true })
    );
  }
}

module.exports = DerpBot;
