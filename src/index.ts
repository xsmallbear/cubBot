import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import hitokotoUtil from "./util/hitokotoUtil";
import fs from "fs";
import path from "path";

const getBot = (): Telegraf => {
  const result = fs.readFileSync(path.join("TOKEN.data"), "utf-8");
  console.log("读取TOKEN为:" + result);
  return new Telegraf(result);
};
const bot: Telegraf = getBot();

bot.on(message("text"), (ctx) => {
  if (ctx.message.text === "早上好") {
    hitokotoUtil().then((data: any) => {
      console.log(data);
      let message = "";
      message += `早上好!\n\n`;
      message += `${data.hitokoto}\t\t--${data.from}\n`;
      ctx.reply(message);
    });
  }
});

bot.launch();
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
