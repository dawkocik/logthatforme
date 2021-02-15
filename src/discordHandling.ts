import {
    Discord,
    On,
    Client,
    ArgsOf
} from "@typeit/discord"
import { Message, TextChannel } from "discord.js";
import path from "path"
import { Telegraf } from "telegraf"


const chars: { [key: string]: string } = { '<': '&lt;', '>': '&gt;', '&': '&amp;' }

// Message.prototype.attachments.toString = (): string => {
//     let result = ""
//     if (typeof this !== "undefined") {
//         (this as unknown as Message).attachments.forEach((a) => {
//             result = `${result}\n${a}`
//         })
//     }
//     return result
// }

@Discord()
export class DiscordLog {
    private static client: Client
    private static telegram: Telegraf;

    static start(telegram: Telegraf, config: any) {
        this.telegram = telegram;
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
            DiscordLog.telegram.telegram.sendMessage(1597000853,
                `💬 ${getTime()}\n` +
                `<b>${message.author.tag}</b> <code>(${message.author.id})</code>\n` +
                `⮡  <b>${textChannel.guild.name}</b> <code>(${textChannel.guild.id})</code>\n` +
                `    ⮡  <b>&#35;${textChannel.name}</b> <code>(${textChannel.id})</code>\n\n` +
                `${message.content.replace(/[<>&]/g, c => chars[c])}` + 
                `<code>(${message.id})</code>`, { parse_mode: 'HTML' }
            );
        }
    }
}

// [12:15:34 31.10.2001]
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