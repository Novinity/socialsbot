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
                { name: "User Commands", value: "/socials - Display the socials for either the specified user, or the server.\n/addsocial - Add a social to your personal list\n/removesocial - Remove social from your personal list." },
                { name: "Server Commands", value: "/addsocial - Add a social to the server's list.\n/removesocial - Remove social from the server's list."}
            )
            .setThumbnail(interaction.guild.iconURL());
        
        interaction.reply({ embeds: [embed] });
    }
}