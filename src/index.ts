import fs from "fs";
import path from "path";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import hitokotoUtil from "./util/hitokotoUtil";
import TictactoeGameManager from "./tictactoeGameManager";
import RemakeManager from "./remakeManager";
import TelegrafLogger from "./telegrafLogger";

const getBot = (): Telegraf => {
  const result = fs.readFileSync(path.join("TOKEN.data"), "utf-8");
  console.log("读取TOKEN成功 开始启动");
  return new Telegraf(result);
};
const bot: Telegraf = getBot();

const logger = new TelegrafLogger({
  log: console.log,
  format: "%ut => @%u %fn %ln (%fi): <%ust> %c",
  contentLength: 100,
});
bot.use(logger.middleware());

new TictactoeGameManager(bot);
new RemakeManager(bot);

// bot.command("goodmorning", (ctx) => {
//   hitokotoUtil().then((data: any) => {
//     console.log(data);
//     let message = "";
//     message += `早上好!\n\n`;
//     message += `${data.hitokoto}\t\t--${data.from}\n`;
//     ctx.reply(message);
//   });
// });

bot.on(message("text"), (ctx) => {
  if (ctx.message.text.includes("早")) {
    hitokotoUtil().then((data: any) => {
      let message = `早上好!\n\n`;
      message += `${data.hitokoto}\t\t\t\t--${data.from}\n`;
      ctx.reply(message);
    });
  } else if (ctx.message.text.includes("午")) {
    hitokotoUtil().then((data: any) => {
      let message = `中午好!\n\n`;
      message += `${data.hitokoto}\t\t\t\t--${data.from}\n`;
      ctx.reply(message);
    });
  } else if (ctx.message.text.includes("晚")) {
    hitokotoUtil().then((data: any) => {
      let message = `晚上好!\n\n`;
      message += `${data.hitokoto}\t\t\t\t--${data.from}\n`;
      ctx.reply(message);
    });
  }
});

(async () => {
  const result = await bot.launch();
  console.log(result);
})();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
