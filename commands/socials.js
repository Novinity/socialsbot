const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('socials')
        .setDescription('Links socials!'),
    async execute(interaction, client) {
        const fileContents = fs.readFileSync('config/config.json', function read(err, data) {
            if (err) throw err;
            return data;
        });
        const obj = JSON.parse(fileContents);

        if (obj.servers[interaction.guild.id.toString()] == null || Object.keys(obj.servers[interaction.guild.id.toString()]).length == 0) {
            interaction.reply("This server doesn't have any socials yet!");
            return;
        }

        let finalMsg = "";
        for (var i in obj.servers[interaction.guild.id.toString()]) {
            finalMsg += "["+i+"]("+obj.servers[interaction.guild.id.toString()][i]+")\n";
        }

        const embed = new EmbedBuilder()
            .setColor(0x88FF8A)
            .setTitle("Socials for " + interaction.guild.name)
            .addFields(
                { name: "Links", value: finalMsg }
            )
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({ text: "It is recommended that you double check the URL you click, just in case!" });

        interaction.reply({ embeds: [embed] });
    }
}