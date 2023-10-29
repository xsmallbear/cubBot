import fs from "fs";
import path from "path";
import { Telegraf } from "telegraf";

import hitokotoUtil from "./util/hitokotoUtil";
import TictactoeGameManager from "./tictactoeGameManager";
import RemakeManager from "./remakeManager";
import RegularMedicationReminder from "./regularMedicationReminder"
import TelegrafLogger from "./telegrafLogger";
import { exit } from "process";

const grouplist = [
  { id: "-1001515727351", title: 'PrimCraftX2', type: 'supergroup' },
  { id: "-1001909939298", title: '从百草园到精神病群', type: 'supergroup' }
]

const getBot = (): Telegraf => {
  const result = fs.readFileSync(path.join("botconfig.json"), "utf-8");
  if (!JSON.parse(result).token) {
    console.log("配置文件异常");
    exit(-1);
  }
  console.log("读取配置文件成功")
  return new Telegraf(JSON.parse(result).token);
};
const bot: Telegraf = getBot();

bot.use(
  new TelegrafLogger({
    log: console.log,
    format: "%ut => @%u %fn %ln (%fi): <%ust> %c",
    contentLength: 100,
  }).middleware()
);

new TictactoeGameManager(bot).command();
new RemakeManager(bot).command();
new RegularMedicationReminder(bot).command();

bot.command("senndTest", ctx => {
  grouplist.forEach(group => {
    bot.telegram.sendMessage(group.id, "这是一个测试消息")
  })
})

bot.hears("早上好", (ctx) => {
  if (ctx.message.text.includes("早上好")) {
    hitokotoUtil().then((data: any) => {
      let message = `早上好!\n\n`;
      message += `${data.hitokoto}\t\t\t\t--${data.from}\n`;
      ctx.reply(message);
    });
  }
})

bot.launch({ dropPendingUpdates: false });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
