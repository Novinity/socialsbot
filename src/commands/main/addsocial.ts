import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

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
                .setRequired(true))
        .addBooleanOption(option =>
            option
                .setName('personal')
                .setDescription('Set whether or not this should be added to your personal account')),
    permissions: [],
    requireAllPermissions: false,
    async execute(interaction: ChatInputCommandInteraction) {
        const sql = interaction.client.sql;

        const title = interaction.options.getString('title');
        const link = interaction.options.getString('link');
        const personal = interaction.options.getBoolean('personal') ?? false;
        const linkedId = personal ? interaction.member?.user.id.toString() : interaction.guild?.id;

        if (!personal && interaction.guild && !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply({content: `You must be an administrator to add socials to this server.`, flags: "Ephemeral"});
            return;
        }

        if (!linkedId) {
            await interaction.reply({
                content: "Failed to get ID to link to.",
                flags: "Ephemeral"
            });
            return;
        }

        const existing = await sql`SELECT * FROM socials WHERE linked_id = ${linkedId} AND name = ${title}`;
        if (existing && existing.length > 0) {
            await interaction.reply({content: "Social must have a unique name from all the other linked socials.", flags: "Ephemeral"});
            return;
        }

        const res = await sql`INSERT INTO socials (linked_id, name, url) VALUES (${linkedId}, ${title}, ${link})`;
        if (res) await interaction.reply({content: `Successfully added [${title}](${link}) to ${personal ? "your" : "the server's"} socials.`, flags: "Ephemeral"});
        else await interaction.reply({content: `Failed to add social.`, flags: "Ephemeral"});
    }
}