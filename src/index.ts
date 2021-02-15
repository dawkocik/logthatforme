import { Telegraf } from 'telegraf'
import { DiscordLog } from './discordHandling'
import { load } from 'js-yaml'
import { readFileSync } from 'fs'
import path from 'path';

let config: any
try {
    const file = readFileSync(path.resolve(__dirname, "config.json"), 'utf8')
    config = JSON.parse(file)
    console.log(config.tokens.telegram)
} catch(e) {
    console.error(e)
}

const telegramBot = new Telegraf(config.tokens.telegram)

DiscordLog.start(telegramBot, config)

telegramBot.on('callback_query', (ctx) => {
    ctx.answerCbQuery()
})

telegramBot.on('inline_query', (ctx) => {
    ctx.answerInlineQuery([])
})

telegramBot.launch()

