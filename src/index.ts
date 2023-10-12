import fs from "fs";
import path from "path";
import { Markup, Telegraf } from "telegraf";
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

// bot.on(message("chess"), (ctx) => {});

// bot.command("chess", (ctx) => {
//   const testData = [
//     ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
//     ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
//     [" ", " ", " ", " ", " ", " ", " ", " "],
//     [" ", " ", " ", " ", " ", " ", " ", " "],
//     [" ", " ", " ", " ", " ", " ", " ", " "],
//     [" ", " ", " ", " ", " ", " ", " ", " "],
//     [" ", " ", " ", " ", " ", " ", " ", " "],
//     ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
//     ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
//   ];

//   const k: Array<Array<any>> = new Array(8).fill(new Array(8).fill(""));
//   for (let x = 0; x < 8; x++) {
//     for (let y = 0; y < 8; y++) {
//       console.log(testData[y][]);
//       k[y][x] = Markup.button.callback(testData[x][y], `chess${y}-${x}`);
//     }
//   }

//   ctx.sendMessage("1", Markup.inlineKeyboard(k));
// });

bot.on(message("text"), (ctx) => {
  if (ctx.message.text.includes("早上好")) {
    hitokotoUtil().then((data: any) => {
      let message = `早上好!\n\n`;
      message += `${data.hitokoto}\t\t\t\t--${data.from}\n`;
      ctx.reply(message);
    });
  }
});

bot
  .launch()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
