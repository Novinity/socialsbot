const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get info on commands'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x88FF8A)
            .setTitle("Help")
            .addFields(
                { name: "User Commands", value: "/socials - Display the server's socials." },
                { name: "Admin Commands", value: "/addsocial - Add a social to the list.\n/removesocial - Remove social from the list."}
            )
            .setThumbnail(interaction.guild.iconURL());
        
        interaction.reply({ embeds: [embed] });
    }
}