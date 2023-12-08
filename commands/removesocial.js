const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removesocial')
        .setDescription('Add a social to the server.')
        .addStringOption(option =>
            option
                .setName('title')
                .setDescription("The title of the link to remove")
                .setRequired(true))
        .addBooleanOption(option =>
            option
                .setName('personal')
                .setDescription('Set whether or not this should to your personal account')
                .setRequired(true)),
    async execute(interaction, client) {
        const personal = interaction.options.getBoolean('personal');

        if (personal) {
            const title = interaction.options.getString('title');
            
            const fileContents = fs.readFileSync('config/config.json', function read(err, data) {
                if (err) throw err;
                return data;
            });
            const obj = JSON.parse(fileContents);

            let link = "";

            for (var i in obj.users[interaction.user.id.toString()]) {
                if (i == title) {
                    link = i;
                    delete obj.users[interaction.user.id.toString()][i]
                    break;
                }
            }

            fs.writeFileSync('config/config.json', JSON.stringify(obj));

            if (link != "") {
                interaction.reply({ content: "Removed " + title + " with link " + link + " from your account!", ephemeral: true });
            } else {
                interaction.reply({ content: "Failed to find item with link " + link + " on your account.\nMake sure you type it in EXACTLY as it is in the message (right click > copy link)!", ephemeral: true });
            }
        } else {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) 
                interaction.reply({ content: "This command requires Administrator permission.", ephemeral: true });

            const title = interaction.options.getString('title');
            
            const fileContents = fs.readFileSync('config/config.json', function read(err, data) {
                if (err) throw err;
                return data;
            });
            const obj = JSON.parse(fileContents);

            let link = "";

            for (var i in obj.servers[interaction.guild.id.toString()]) {
                if (obj.servers[interaction.guild.id.toString()] == title) {
                    title = i;
                    delete obj.servers[interaction.guild.id.toString()][i]
                    break;
                }
            }

            fs.writeFileSync('config/config.json', JSON.stringify(obj));

            if (title != "") {
                interaction.reply({ content: "Removed " + title + " with link " + link + "!", ephemeral: true });
            } else {
                interaction.reply({ content: "Failed to find item with link " + link + ".\nMake sure you type it in EXACTLY as it is in the message (right click > copy link)!", ephemeral: true });
            }
        }
    }
}