// グローバルに状態を管理するためのアトムを定義するファイル
import { atom } from "recoil";
import { SimilarKeywordResponse } from "../_services/backEnd";

// ロード中であるか否かを管理するアトム
export const isLoadingState = atom<boolean>({
  key: "isLoadingState",
  default: false,
});
