import { Markup, Telegraf } from "telegraf";
import TictactoeGame from "./data/TictactoeGame";
import { game } from "telegraf/typings/button";
import { User } from "telegraf/typings/core/types/typegram";

const tictactoeGames: Map<number, Array<TictactoeGame>> = new Map();

const printTictactoe = (game: TictactoeGame) => {
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(game.checkerboard[0], "ttt0"),
      Markup.button.callback(game.checkerboard[1], "ttt1"),
      Markup.button.callback(game.checkerboard[2], "ttt2"),
    ],
    [
      Markup.button.callback(game.checkerboard[3], "ttt3"),
      Markup.button.callback(game.checkerboard[4], "ttt4"),
      Markup.button.callback(game.checkerboard[5], "ttt5"),
    ],
    [
      Markup.button.callback(game.checkerboard[6], "ttt6"),
      Markup.button.callback(game.checkerboard[7], "ttt7"),
      Markup.button.callback(game.checkerboard[8], "ttt8"),
    ],
  ]);
  return keyboard;
};

/**
 * 检查是否在一个群中
 * @param ctx
 * @returns
 */
const checkIsGroup = (ctx: any): boolean => {
  const chat = ctx.chat;
  if (chat && (chat.type == "supergroup" || chat.type == "group")) {
    return true;
  } else {
    return false;
  }
};

/**
 * 创建一个游戏
 * @param user
 */
const createGame = (groupId: number, user1: User): boolean => {
  if (!tictactoeGames.get(groupId)) {
    tictactoeGames.set(groupId, new Array());
  }
  let flag = false;
  (tictactoeGames.get(groupId) as Array<TictactoeGame>).forEach((game) => {
    if (game.checkPlay(user1)) {
      flag = true;
    }
  });
  if (flag) {
    return false;
  }

  const newGame = new TictactoeGame(user1);
  (tictactoeGames.get(groupId) as Array<TictactoeGame>).push(newGame);
  return true;
};

/**
 * 加入一个游戏
 * @param groupId
 * @param user2
 */
const addGame = (groupId: number, user2: User): TictactoeGame | undefined => {
  if (!tictactoeGames.get(groupId)) {
    return undefined;
  }
  const currentGrouopGames = tictactoeGames.get(groupId);
  if (currentGrouopGames) {
    for (let i = 0; i < currentGrouopGames.length; i++) {
      let game = currentGrouopGames[i];
      if (game.start == false) {
        game.join(user2);
        return game;
      }
    }
  }
};

/**
 * 获取自己所在的游戏
 */
const getMyGame = (groupId: number, user: User): TictactoeGame | undefined => {
  if (!tictactoeGames.get(groupId)) {
    return undefined;
  }
  const currentGrouopGames = tictactoeGames.get(groupId);

  if (currentGrouopGames) {
    for (let i = 0; i < currentGrouopGames.length; i++) {
      let game = currentGrouopGames[i];
      if (game.checkPlay(user)) {
        return game;
      }
    }
  }
};

const printGame = async (ctx: any, game: TictactoeGame, first = false) => {
  let message = "";
  if (first) {
    message += "开始游\n";
  }
  message += `玩家1: @${game.play1.username}\n`;
  message += `玩家2: @${game.play2.username}\n`;
  message += `当前行动的是: @${game.nextPlay.username}\n`;
  if (game.preMessage) {
    ctx.deleteMessage(game.preMessage.message_id);
  }
  game.preMessage = await ctx.sendMessage(message, printTictactoe(game));
};

const tictactoe = (bot: Telegraf) => {
  bot.command("new_tictactoe", async (ctx) => {
    if (checkIsGroup(ctx) == false) {
      ctx.sendMessage("请在群里使用哦");
    }
    const chat = ctx.chat;
    const chatId = chat.id;
    if (createGame(chatId, ctx.from)) {
      ctx.sendMessage(
        "开启了一局游戏 等待加入 请使用 /join_tictactoe 加入游戏"
      );
    } else {
      ctx.sendMessage("创建游戏失败 你已经有一个创建的游戏了哦");
    }
  });

  bot.command("join_tictactoe", async (ctx) => {
    if (checkIsGroup(ctx) == false) {
      ctx.sendMessage("请在群里使用哦");
    }
    const chat = ctx.chat;
    const chatId = chat.id;
    const game = addGame(chatId, ctx.from);
    if (game) {
      printGame(ctx, game, true);
    }
  });

  bot.command("tictactoe", async (ctx) => {
    let result = `/new_tictactoe 创建一个新游戏\n`;
    result += `/join_tictactoe 加入游戏\n`;

    result += `\ninfo\n`;
    tictactoeGames.forEach((games, id) => {
      result += `群id${id}\n`;
      result += `======================\n`;
      games.forEach((game) => {
        result += `玩家1:id${game.play1} 玩家2:${game.play2}\n`;
      });
      result += `======================\n`;
    });
    ctx.sendMessage(result);
  });

  for (let i = 0; i < 8; i++) {
    bot.action(`ttt${i}`, (ctx) => {
      if (ctx.chat) {
        const myGame = getMyGame(ctx.chat.id, ctx.from as User);
        //check myself is nextPlay
        if (ctx.from?.id === myGame?.nextPlay.id) {
          myGame?.setState(i);
          printGame(ctx, myGame as TictactoeGame);
          console.log("赢了嘛:", myGame?.checkWin());
        }
      }
    });
  }
};

export default tictactoe;
