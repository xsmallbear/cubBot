import { User } from "telegraf/typings/core/types/typegram";
import generateRandomNumber from "../util/generateRandomNumber";

type TicTacToeCell = "X" | "O" | " ";

export default class TictactoeGame {
  checkerboard: Array<TicTacToeCell> = new Array(9).fill(" ");
  preMessage: any;
  nextPlay!: User;
  nextFlag: "X" | "O" = "X";
  play1!: User;
  play2!: User;
  start: boolean = false;
  constructor(play1: User) {
    this.play1 = play1;
  }
  join(play2: User) {
    this.play2 = play2;
    this.start = true;
    if (generateRandomNumber(0, 1) === 0) {
      this.nextPlay = this.play1;
    } else {
      this.nextPlay = this.play2;
    }
  }
  checkPlay(playId: User) {
    return playId.id === this.play1?.id || playId.id === this.play2?.id;
  }
  setState(index: number): boolean {
    if (this.checkerboard[index] === " ") {
      this.checkerboard[index] = this.nextFlag;
      this.nextFlag = this.nextFlag == "X" ? "O" : "X";
      return true;
    }
    return false;
  }
  checkWin() {
    const data = this.checkerboard;
    const checkLocations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 6, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    checkLocations.forEach((check) => {
      if (
        data[check[0]] === " " ||
        data[check[1]] === " " ||
        data[check[2]] === " "
      )
        return false;

      if (data[check[0]] === data[check[1]] && data[check[1]] === data[check[2]])
        return true;
    });

    return false;
  }
}
