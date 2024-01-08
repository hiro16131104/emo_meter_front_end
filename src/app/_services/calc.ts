// 各種計算を行うクラス
export class Calc {
  // 小数点第n位で切り捨てる
  public static floor(value: number, n: number): number {
    // 10のn乗で割って、小数点第n位を切り捨てた後、10のn乗を掛ける
    const pow: number = Math.pow(10, n);
    return Math.floor(value * pow) / pow;
  }

  // 最小値以上、最大値以下の整数をランダムに返す
  public static getRandomInt(min: number, max: number): number {
    // 最小値を切り上げ、最大値を切り捨てる
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);

    // ランダムな整数を返す
    return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
  }
}
