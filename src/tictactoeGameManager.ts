import { Markup, Telegraf } from "telegraf";
import TictactoeGame from "./types/TictactoeGame";
import { Game, User } from "telegraf/typings/core/types/typegram";

export default class TictactoeGameManager {
  //tic tac toe game data
  games: Map<number, Array<TictactoeGame>> = new Map();
  //use this game manager for bot
  bot: Telegraf;

  constructor(bot: Telegraf) {
    this.bot = bot;
    bot.command("new_tictactoe", async (ctx) => {
      if (this.checkIsGroup(ctx) == false) {
        ctx.sendMessage("请在群里使用哦");
      }
      if (this.createGame(ctx.chat.id, ctx.from)) {
        ctx.sendMessage(
          "开启了一局游戏 等待加入 请使用 /join_tictactoe 加入游戏"
        );
      } else {
        ctx.sendMessage("创建游戏失败 你已经有一个创建的游戏了哦");
      }
    });
    bot.command("join_tictactoe", async (ctx) => {
      if (this.checkIsGroup(ctx) == false) {
        ctx.sendMessage("请在群里使用哦");
      }
      const game = this.addGame(ctx.chat.id, ctx.from);
      if (game) {
        this.printGame(ctx, game, true);
      } else {
        ctx.sendMessage("当前没有游戏可以加入哦");
      }
    });
    bot.command("tictactoe", async (ctx) => {
      let result = `/new_tictactoe 创建一个新游戏\n`;
      result += `/join_tictactoe 加入游戏\n`;

      result += `\ninfo\n`;
      this.games.forEach((games, id) => {
        result += `群id${id}\n`;
        result += `======================\n`;
        games.forEach((game) => {
          result += `玩家1:id${game.play1} 玩家2:${game.play2}\n`;
        });
        result += `======================\n`;
      });
      ctx.sendMessage(result);
    });

    //call back functions
    for (let i = 0; i <= 8; i++) {
      bot.action(`ttt${i}`, (ctx) => {
        if (ctx.chat) {
          const myGame = this.getMyGame(
            ctx.chat.id,
            ctx.from as User
          ) as TictactoeGame;
          //check myself is nextPlay
          if (
            myGame &&
            myGame.state !== "finish" &&
            ctx.from!.id === myGame.nextPlay.id
          ) {
            myGame.setState(i);
            this.printGame(ctx, myGame as TictactoeGame);
            const win = myGame.checkWin();
            if (win) {
              this.deleteGame(ctx.chat.id, myGame);
              ctx.sendMessage("游戏结束 胜利的是@" + win.username);
            }
          } else {
            ctx.answerCbQuery();
          }
        }
      });
    }
  }

  checkIsGroup = (ctx: any): boolean => {
    const chat = ctx.chat;
    if (chat && (chat.type == "supergroup" || chat.type == "group")) {
      return true;
    } else {
      return false;
    }
  };

  createGame(groupId: number, user1: User): boolean {
    if (!this.games.get(groupId)) {
      this.games.set(groupId, new Array());
    }
    let flag = false;
    (this.games.get(groupId) as Array<TictactoeGame>).forEach((game) => {
      if (game.checkPlayInGame(user1)) {
        flag = true;
      }
    });
    if (flag) {
      return false;
    }

    const newGame = new TictactoeGame(user1);
    (this.games.get(groupId) as Array<TictactoeGame>).push(newGame);
    return true;
  }

  addGame = (groupId: number, user2: User): TictactoeGame | undefined => {
    if (!this.games.get(groupId)) {
      return undefined;
    }
    const currentGrouopGames = this.games.get(groupId);
    if (currentGrouopGames) {
      for (let i = 0; i < currentGrouopGames.length; i++) {
        let game = currentGrouopGames[i];
        if (game.state === "ready") {
          game.join(user2);
          return game;
        }
      }
    }
  };

  getMyGame = (groupId: number, user: User): TictactoeGame | undefined => {
    if (!this.games.get(groupId)) {
      return undefined;
    }
    const currentGrouopGames = this.games.get(groupId);

    if (currentGrouopGames) {
      for (let i = 0; i < currentGrouopGames.length; i++) {
        let game = currentGrouopGames[i];
        if (game.checkPlayInGame(user)) {
          return game;
        }
      }
    }
  };

  deleteGame = (groupId: number, game: TictactoeGame) => {
    const currentGrouopGames = this.games.get(groupId) as Array<TictactoeGame>;
    currentGrouopGames.splice(currentGrouopGames.indexOf(game), 1);
  };

  printTictactoe = (game: TictactoeGame) => {
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

  printGame = async (ctx: any, game: TictactoeGame, first = false) => {
    let message = "";
    if (first) {
      message += "开始游戏\n";
    }
    message += `玩家1:\t@${game.play1.username}\n`;
    message += `玩家2:\t@${game.play2.username}\n`;
    message += `当前行动的是:\t@${game.nextPlay.username}\n`;
    if (game.preTelegramMessage) {
      ctx.deleteMessage(game.preTelegramMessage.message_id);
    }
    game.preTelegramMessage = await ctx.sendMessage(
      message,
      this.printTictactoe(game)
    );
  };
}
