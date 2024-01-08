// 設定ファイルをインポート
import settings from "./settings.json";

export interface KeywordsItem {
  keyword: string;
  color: string;
  msgs: string[];
}

// 設定ファイルから値を取得するクラス
export class Config {
  // 環境
  public static readonly environment = settings["environment"]["value"] as
    | "production"
    | "development";
  // バックエンドのURL
  public static readonly backendUrl: string =
    settings["backend"]["url"][this.environment];
  // HTMLのメタデータの設定
  public static readonly metadata = settings["metadata"] as {
    title: string;
    description: string;
  };
  // ブラウザのローカルストレージに保存する際のキー
  public static readonly localStoragePrefix: string =
    settings["localStrage"]["prefix"];
  // ページを跨いで使用する設定
  public static readonly page = settings["page"]["common"] as {
    // 測定する際に使用するアイテム
    keywords: KeywordsItem[];
  };
  // sentenceページの設定
  public static readonly sentencePage = settings["page"]["sentence"] as {
    // 対応しているファイル形式
    extensions: string[];
    // ファイルの最大サイズ
    maxFileSize: number;
    // 文章の最大文字数
    maxWordCount: number;
    // 例文
    examples: string[];
  };
}
