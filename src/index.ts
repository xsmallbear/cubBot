import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import remark from "./util/remark";
import fs from "fs";
import path from "path";
import hitokotoUtil from "./util/hitokotoUtil";
import tictactoe from "./tictactoe";

const getBot = (): Telegraf => {
  const result = fs.readFileSync(path.join("TOKEN.data"), "utf-8");
  console.log("读取TOKEN成功 开始启动");
  return new Telegraf(result);
};
const bot: Telegraf = getBot();

tictactoe(bot);

bot.command("remake", (ctx) => {
  ctx.reply(`你自杀成功了,转生到了${remark()}`);
});

bot.command("goodmorning", (ctx) => {
  hitokotoUtil().then((data: any) => {
    console.log(data);
    let message = "";
    message += `早上好!\n\n`;
    message += `${data.hitokoto}\t\t--${data.from}\n`;
    ctx.reply(message);
  });
});

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
