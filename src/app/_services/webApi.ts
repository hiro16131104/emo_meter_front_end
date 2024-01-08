import axios, { AxiosResponse } from "axios";

// WebApiと接続するクラス
export class WebApi {
  private readonly url: string;
  public readonly HEADERS = {
    FORM_DATA: { "Content-Type": "multipart/form-data" },
    JSON: { "Content-Type": "application/json" },
  };

  // コンストラクタ
  constructor(url: string) {
    this.url = url;
  }

  // 値がオブジェクトかどうかを判定する
  private isObject(value: any): boolean {
    return value && typeof value === "object";
  }

  // ケバブケースやスネークケースの文字列をキャメルケースに変換する
  private toCamelCase(str: string): string {
    return str.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );
  }

  // ケバブケースやスネークケースのオブジェクトのキーをキャメルケースに変換する
  private convertKeysToCamelCase(object: any): any {
    const newObject: any = {};

    // オブジェクト（配列や関数も含む）でない場合はそのまま返す
    if (!this.isObject(object)) {
      return object;
    }

    // 配列の場合は配列の中身をキャメルケースに変換する
    if (Array.isArray(object)) {
      // 再帰的に処理する
      return object.map((item) => this.convertKeysToCamelCase(item));
    }

    // オブジェクトの場合はキーをキャメルケースに変換する
    for (const key in object) {
      const newKey: string = this.toCamelCase(key);
      const value: any = object[key];

      // 再帰的に処理することで、ネストされたオブジェクトもキャメルケースに変換する
      newObject[newKey] = this.convertKeysToCamelCase(value);
    }

    return newObject;
  }

  // リクエスト（GET）
  public async callApiGet<T>(path: string): Promise<T> {
    // レスポンスがあるまで待機
    const response: AxiosResponse<T, any> = await axios.get<T>(
      `${this.url}${path}`
    );
    // キーをキャメルケースに変換して返す
    return this.convertKeysToCamelCase(response.data);
  }

  // リクエスト（POST）
  public async callApiPost<T>(
    path: string,
    data: any,
    headers?: any
  ): Promise<T> {
    // レスポンスがあるまで待機
    const response: AxiosResponse<T, any> = await axios.post<T>(
      `${this.url}${path}`,
      data,
      headers
    );
    // キーをキャメルケースに変換して返す
    return this.convertKeysToCamelCase(response.data);
  }

  // リクエスト（PUT）
  public async callApiPut<T>(path: string, data?: any): Promise<T> {
    // レスポンスがあるまで待機
    const response: AxiosResponse<T, any> = await axios.put<T>(
      `${this.url}${path}`,
      data
    );
    // キーをキャメルケースに変換して返す
    return this.convertKeysToCamelCase(response.data);
  }
}
