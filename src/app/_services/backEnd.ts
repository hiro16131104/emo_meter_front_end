import axios, { AxiosResponse } from "axios";

// オリジナルのクラスをインポート
import { Config } from "../../config/config";
import { WebApi } from "./webApi";

export interface SimilarityResponse {
  sentences: string[];
  similarInfomations: { [key: string]: string | number[] }[];
}
export interface Result {
  sentence: string;
  keyword: string;
  similarity: number;
}
export interface SimilarKeywordResponse {
  results: Result[];
}

// バックエンドとの通信を行うクラス
export class BackEnd {
  private readonly url: string = Config.backendUrl;
  private readonly webApi: WebApi;

  // コンストラクタ
  constructor() {
    this.webApi = new WebApi(this.url);
  }
  // ユーザーIDを作成する
  public async createUserId(): Promise<string> {
    try {
      const PATH: string = "/api/create_user_id";
      // レスポンスがあるまで待機
      const response: { userId: string } = await this.webApi.callApiGet(PATH);
      return response.userId;
    } catch (error) {
      throw error;
    }
  }

  // ドキュメントファイルをアップロードし、テキストを抽出する
  public async readDocumentFile(userId: string, file: File): Promise<string> {
    try {
      const PATH: string = "/api/read_document_file";
      const formData = new FormData();
      const headers = this.webApi.HEADERS.FORM_DATA;
      let response: { text: string };

      // フォームデータを作成
      formData.append("user_id", userId);
      formData.append("file", file);
      // レスポンスがあるまで待機
      response = await this.webApi.callApiPost(PATH, formData, headers);
      return response.text;
    } catch (error) {
      throw error;
    }
  }

  // 最終アクセス日時を更新する
  public async updateLastAccessedAt(userId: string): Promise<string> {
    try {
      const PATH: string = `/api/update_last_accessed_at/${userId}`;
      // レスポンスがあるまで待機
      const response: { message: string } = await this.webApi.callApiPut(PATH);
      return response.message;
    } catch (error) {
      throw error;
    }
  }

  // 文章とキーワードの類似度を計算する
  public async calculateSimilarity(
    userId: string,
    keywords: string[],
    text: string
  ): Promise<SimilarityResponse> {
    try {
      const PATH: string = "/api/calculate_similarity";
      // JSON形式のデータを作成
      const data = { user_id: userId, keywords: keywords, text: text };
      const headers = this.webApi.HEADERS.JSON;
      // レスポンスがあるまで待機
      const response: SimilarityResponse = await this.webApi.callApiPost(
        PATH,
        data,
        headers
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  // 各文章に対して類似度が最も高いキーワードを決定する
  public async determineSimilarKeyword(
    userId: string,
    sentences: string[],
    similarInfomations: { [key: string]: string | number[] }[]
  ): Promise<SimilarKeywordResponse> {
    try {
      const PATH: string = "/api/determine_similar_keyword";
      // JSON形式のデータを作成
      const data = {
        user_id: userId,
        sentences: sentences,
        similar_infomations: similarInfomations,
      };
      const headers = this.webApi.HEADERS.JSON;
      // レスポンスがあるまで待機
      const response: SimilarKeywordResponse = await this.webApi.callApiPost(
        PATH,
        data,
        headers
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  // 学習済みモデルを読み込む（API側のインスタンスにてキャッシュしておく）
  public async loadLearnedModel(
    userId: string,
    keywords: string[]
  ): Promise<void> {
    const PATH: string = "/api/calculate_similarity";
    // JSON形式のデータを作成
    const data = { user_id: userId, keywords: keywords, text: "ダミー文字列" };
    const headers = this.webApi.HEADERS.JSON;

    // 非同期で通信を行う（レスポンスされた内容は使用しない）
    axios
      .post(`${this.url}${PATH}`, data, headers as any)
      .then(() => {
        console.log("Learned model has been loaded.");
      })
      .catch((error) => {
        console.log("Failed to load learned model.");
      });
  }
}
