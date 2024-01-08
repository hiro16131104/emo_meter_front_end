import { Config } from "../../config/config";
import { Result } from "./backEnd";

// ブラウザにアクセスするクラス
export class Browser {
  // ローカルストレージに保存する際のキーを作成する
  private static createLocalStrageKey(key: string): string {
    return `${Config.localStoragePrefix}_${key}`;
  }

  // ローカルストレージにオブジェクトを保存する
  public static setObjectToLocalStorage(key: string, object: any): void {
    const value: string = JSON.stringify(object);
    localStorage.setItem(this.createLocalStrageKey(key), value);
  }

  // ローカルストレージからオブジェクトを取得する
  public static getObjectFromLocalStorage(key: string): any | null {
    const value: string | null = localStorage.getItem(
      this.createLocalStrageKey(key)
    );
    return value ? JSON.parse(value) : null;
  }

  // ローカルストレージからオブジェクトを削除する
  public static removeObjectFromLocalStorage(key: string): void {
    localStorage.removeItem(this.createLocalStrageKey(key));
  }

  // ローカルストレージにユーザーIDを保存する
  public static setUserIdToLocalStorage(userId: string): void {
    this.setObjectToLocalStorage("userId", userId);
  }

  // ローカルストレージに測定結果を保存する
  public static setResultsToLocalStorage(results: Result[]): void {
    this.setObjectToLocalStorage("results", results);
  }

  // ローカルストレージに測定メッセージを保存する
  public static setResultMsgToLocalStorage(resultMsg: string): void {
    this.setObjectToLocalStorage("resultMsg", resultMsg);
  }

  // ローカルストレージからユーザーIDを取得する
  public static getUserIdFromLocalStorage(): string | null {
    return this.getObjectFromLocalStorage("userId");
  }

  // ローカルストレージから測定結果を取得する
  public static getResultsFromLocalStorage(): Result[] | null {
    return this.getObjectFromLocalStorage("results");
  }

  // ローカルストレージから測定メッセージを取得する
  public static getResultMsgFromLocalStorage(): string | null {
    return this.getObjectFromLocalStorage("resultMsg");
  }

  // ローカルストレージからユーザーIDを削除する
  public static removeUserIdFromLocalStorage(): void {
    this.removeObjectFromLocalStorage("userId");
  }

  // ローカルストレージから測定結果を削除する
  public static removeResultsFromLocalStorage(): void {
    this.removeObjectFromLocalStorage("results");
  }

  // ローカルストレージから測定メッセージを削除する
  public static removeResultMsgFromLocalStorage(): void {
    this.removeObjectFromLocalStorage("resultMsg");
  }

  // 本番環境でなければ、console.logを実行する
  public static consoleWrite(object: any): void {
    if (Config.environment === "production") return;
    console.log(object);
  }
}
