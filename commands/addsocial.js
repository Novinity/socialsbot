const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addsocial')
        .setDescription('Add a social to the server.')
        .addStringOption(option =>
            option
                .setName('title')
                .setDescription("The title displayed for your link")
                .setRequired(true))
        .addStringOption(option => 
            option
                .setName('link')
                .setDescription("The link to add")
                .setRequired(true)),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) 
            interaction.reply({ content: "This command requires Administrator permission.", ephemeral: true });
        
        const link = interaction.options.getString('link');
        const title = interaction.options.getString('title');
        
        const fileContents = fs.readFileSync('config/config.json', function read(err, data) {
            if (err) throw err;
            return data;
        });
        const obj = JSON.parse(fileContents);

        if (title) {
            obj.servers[interaction.guild.id.toString()][title] = link;
        } else {
            obj.servers[interaction.guild.id.toString()][link] = link;
        }

        fs.writeFileSync('config/config.json', JSON.stringify(obj));

        interaction.reply({ content: "Added " + link + " as " + title + "!", ephemeral: true });
    }
}