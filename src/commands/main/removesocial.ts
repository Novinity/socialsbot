import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removesocial')
        .setDescription('Remove a social from the server or your profile.')
        .addStringOption(option =>
            option
                .setName('title')
                .setDescription("The title of the link to remove")
                .setRequired(true))
        .addBooleanOption(option =>
            option
                .setName('personal')
                .setDescription('Set whether or not this should be removed from your personal account')),
    permissions: [],
    requireAllPermissions: false,
    async execute(interaction: ChatInputCommandInteraction) {
        const sql = interaction.client.sql;

        const title = interaction.options.getString('title');
        const personal = interaction.options.getBoolean('personal') ?? false;
        const linkedId = personal ? interaction.member?.user.id.toString() : interaction.guild?.id;

        if (!personal && interaction.guild && !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply({content: `You must be an administrator to remove socials from this server.`, flags: "Ephemeral"});
            return;
        }

        const existing = await sql`SELECT * FROM socials WHERE linked_id = ${linkedId} AND name = ${title}`;
        if (existing && existing.length === 0) {
            await interaction.reply({content: "No social with this name is linked.", flags: "Ephemeral"});
            return;
        }

        const res = await sql`DELETE FROM socials WHERE linked_id = ${linkedId} AND name = ${title}`;
        if (res) await interaction.reply({content: `Successfully removed ${title} from ${personal ? "your" : "the server's"} socials.`, flags: "Ephemeral"});
        else await interaction.reply({content: `Failed to remove social.`, flags: "Ephemeral"});
    }
}