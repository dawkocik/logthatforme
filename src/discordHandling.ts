import {
    Discord,
    On,
    Client,
    ArgsOf
} from "@typeit/discord"
import { GuildChannel, Message, TextChannel } from "discord.js";
import path from "path"
import { Telegraf } from "telegraf"


const chars: { [key: string]: string } = { '<': '&lt;', '>': '&gt;', '&': '&amp;' }

@Discord()
export class DiscordLog {
    private static client: Client
    private static telegram: Telegraf;
    private static telegramID: number

    static start(telegram: Telegraf, config: any) {
        this.telegram = telegram;
        this.telegramID = config.telegramID
        this.client = new Client()
        this.client.login(
            config.tokens.discord,
            `${path.join(__dirname)}/*Discord.ts`
        )
    }

    @On("message")
    async onMessage([message]: ArgsOf<"message">) {
        if (message.author.id !== DiscordLog.client.user?.id) {
            const textChannel = message.channel as TextChannel

            let attachments = ""
            message.attachments.forEach((a) => {
                attachments += a.url + "\n"
            })

            DiscordLog.telegram.telegram.sendMessage(1597000853,
                `💬 ${getTime()}\n` +
                `<b>${message.author.tag}</b> <code>(${message.author.id})</code>\n` +
                `⮡  <b>${textChannel.guild.name}</b> <code>(${textChannel.guild.id})</code>\n` +
                `    ⮡  <b>${textChannel.name}</b> <code>(${textChannel.id})</code>\n\n` +
                `${message.content.replace(/[<>&]/g, c => chars[c])}` +
                `<code>(${message.id})</code>\n` +
                `${attachments}`, { parse_mode: 'HTML' }
            );
        }
    }

    @On("channelCreate")
    async onChannelCreate([channel]: ArgsOf<"channelCreate">) {
        const guildChannel = channel as GuildChannel
        const log = (await guildChannel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_CREATE'
        })).entries.first()
        
        DiscordLog.telegram.telegram.sendMessage(DiscordLog.telegramID,
            `🆕📁 ${getTime()}\n` +
            `<b>${log?.executor.tag}</b> <code>(${log?.executor.id})</code>\n` + 
            `⮡  <b>${guildChannel.guild.name}</b> <code>(${guildChannel.guild.id})</code>\n` +
            `    ⮡  Created a new ${channel.type} channel\n` +
            `        ⮡  <b>${guildChannel.name}</b> <code>${guildChannel.id}</code>`, { parse_mode: 'HTML' })
    }
}

// [hh:mm:ss dd.mm.yyyy]
const getTime = (): string => {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()

    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    return `[${hours}:${minutes}:${seconds} ${day}.${month}.${year}]`
}