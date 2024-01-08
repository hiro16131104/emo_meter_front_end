// 色に関する処理をまとめたクラス
export class Color {
  // カラーコード（HEX）をRGBに変換する
  public static hexToRgb(hexColor: string): number[] {
    let colorCode: string = "";
    let rgb: number[] = [];

    // 引数のチェック
    if (hexColor.length != 7) {
      throw new Error("hexColorは7文字にしてください（例: #3ea8ff)。");
    }

    // 先頭の#を削除
    colorCode = hexColor.startsWith("#") ? hexColor.slice(1) : hexColor;
    // 16進数を10進数に変換
    rgb = [
      parseInt(colorCode.slice(0, 2), 16),
      parseInt(colorCode.slice(2, 4), 16),
      parseInt(colorCode.slice(4, 6), 16),
    ];

    return rgb;
  }

  // RGBをカラーコード（HEX）に変換する
  public static rgbToHex(rgbColor: number[]): string {
    let hex: string = "";

    // 引数のチェック
    if (rgbColor.length != 3) {
      throw new Error("rgbColorは3要素にしてください。");
    }

    // 10進数を16進数に変換し、必ず2桁になるようにする
    hex =
      "#" +
      rgbColor
        .map((color) => {
          const hexPart = color.toString(16);
          return hexPart.length === 1 ? "0" + hexPart : hexPart;
        })
        .join("");

    return hex;
  }

  // 色を暗くする
  public static darkenColor(hexColor: string, percent: number): string {
    let rgb: number[] = [];
    let rgbDark: number[] = [];

    // 引数のチェック
    if (percent < 0 || percent > 100) {
      throw new Error("percentは0以上100以下にしてください。");
    }

    // HEXをRGBに変換
    rgb = this.hexToRgb(hexColor);
    // 暗くする（小数点以下切り捨て）
    rgbDark = rgb.map((color) => {
      return Math.floor(color * (1 - percent / 100));
    });

    // RGBをHEXに変換して返す
    return this.rgbToHex(rgbDark);
  }

  // 色を明るくする
  public static lightenColor(hexColor: string, percent: number): string {
    let rgb: number[] = [];
    let rgbLight: number[] = [];

    // 引数のチェック
    if (percent < 0 || percent > 100) {
      throw new Error("percentは0以上100以下にしてください。");
    }

    // HEXをRGBに変換
    rgb = this.hexToRgb(hexColor);
    // 明るくする（小数点以下切り捨て）
    rgbLight = rgb.map((color) => {
      return Math.floor(color + (255 - color) * (percent / 100));
    });

    // RGBをHEXに変換して返す
    return this.rgbToHex(rgbLight);
  }
}
