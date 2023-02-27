require("dotenv").config();
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const token = process.env.token;
const fs = require('node:fs');
const path = require('node:path');
const cron = require('node-cron');
const yeteeutil = require('./yeteeutil.js')

//create client with standard intents
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
//load commands from commands folder into a collection (extends js "map" class)
client.commands = new Collection();

//get path to commands
const commandsPath = path.join(__dirname, 'commands');
//put all command files into an array
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//loop over commandFiles array and put all commands into the client.commands collection
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

//turn on the bot
client.once(Events.ClientReady,async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

    //yetee daily post cron job
    let yeteeSchedule = new cron.schedule('1 0 * * *', async function() {
        console.log('Running a job at 12:01 AM in Central Standard Time');
        //create and send embed to off-torchic
        shirts = await yeteeutil.getShirts();
        //if you create multiple embeds and send them all at once you can force discord to post multi-image embeds! only the first embed should have a title or other attributes
        let embed1 = new EmbedBuilder().setTitle("Yop Yop! New Yetee shirts coming your way!").setURL('https://theyetee.com').setImage('https://someimagelink.jpg')
        let embed2 = new EmbedBuilder().setURL('https://theyetee.com').setImage(`${shirts[0]}`)
        let embed3 = new EmbedBuilder().setURL('https://theyetee.com').setImage(`${shirts[1]}`)
        client.channels.cache.find(c => c.id === '746796389362565130').send({embeds: [embed1, embed2, embed3]});
    }, {
        scheduled: true,
        timezone: "US/Central"
    })

    yeteeSchedule.start();
    //end yetee job
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
	console.log(interaction);

    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Log in to Discord with token
client.login(token);