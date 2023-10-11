import { Message, User } from "telegraf/typings/core/types/typegram";
import numberRadom from "../util/radom";

type TicTacToeCell = "X" | "O" | " ";

export default class TictactoeGame {
  checkerboard: Array<TicTacToeCell> = new Array(9).fill(" ");
  preTelegramMessage!: Message;
  nextPlay!: User;
  play1!: User;
  play2!: User;
  play1Flag!: "X" | "O";
  play2Flag!: "X" | "O";
  state: "ready" | "starting" | "finish" = "ready";
  constructor(play1: User) {
    this.play1 = play1;
  }
  join(play2: User) {
    this.play2 = play2;
    this.state = "starting";
    if (numberRadom(0, 1) === 0) {
      this.nextPlay = this.play1;
      this.play1Flag = "X";
      this.play2Flag = "O";
    } else {
      this.nextPlay = this.play2;
      this.play1Flag = "O";
      this.play2Flag = "X";
    }
  }
  checkPlayInGame(playId: User) {
    return playId.id === this.play1?.id || playId.id === this.play2?.id;
  }
  setState(index: number): boolean {
    if (this.checkerboard[index] === " ") {
      if (this.nextPlay === this.play1) {
        this.checkerboard[index] = this.play1Flag;
        this.nextPlay = this.play2;
      } else {
        this.checkerboard[index] = this.play2Flag;
        this.nextPlay = this.play1;
      }
      return true;
    }
    return false;
  }
  checkWin() {
    let currentFlag = " ";
    let play;
    //
    //pre player is current player
    //
    if (this.nextPlay === this.play1) {
      play = this.play2;
      currentFlag = this.play2Flag;
    } else {
      play = this.play1;
      currentFlag = this.play1Flag;
    }
    for (let i = 0; i < 3; i++) {
      if (
        this.checkerboard[i * 3] === currentFlag &&
        this.checkerboard[i * 3 + 1] === currentFlag &&
        this.checkerboard[i * 3 + 2] === currentFlag
      ) {
        this.state = "finish";
        return play;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        this.checkerboard[i] === currentFlag &&
        this.checkerboard[i + 3] === currentFlag &&
        this.checkerboard[i + 6] === currentFlag
      ) {
        this.state = "finish";
        return play;
      }
    }
    if (
      this.checkerboard[0] === currentFlag &&
      this.checkerboard[4] === currentFlag &&
      this.checkerboard[8] === currentFlag
    ) {
      this.state = "finish";
      return play;
    }
    if (
      this.checkerboard[2] === currentFlag &&
      this.checkerboard[4] === currentFlag &&
      this.checkerboard[6] === currentFlag
    ) {
      this.state = "finish";
      return play;
    }
    return undefined;
  }
}
