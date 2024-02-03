// クライアントコンポーネント
"use client";

import Link from "next/link";
import { RecoilRoot } from "recoil";
import React from "react";
// オリジナルのコンポーネントをインポート
import NoScript from "./_components/NoScript/NoScript";
import Container from "./_components/Container/Container";
import Header from "./_components/Header/Header";
import MainTitle from "./_components/MainTitle/MainTitle";
import Footer from "./_components/Footer/Footer";
import MainContainer from "./_components/MainContainer/MainContainer";
import Loader from "./_components/Loader/Loader";
import UserIdManager from "./_components/UserIdManager/UserIdManager";
// オリジナルのクラスをインポート
import { Config, KeywordsItem } from "../config/config";
import { Browser } from "./_services/browser";
import { BackEnd } from "./_services/backEnd";
// cssをインポート
import "./_styles/globals.scss";
import "./_styles/animations.scss";
import styles from "./layout.module.scss";

// 分割代入
const { title, description } = Config.metadata;
// 測定する際に使用するアイテム
const keywords: KeywordsItem[] = Config.page.keywords;

// ページのレイアウト
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  // API側のインスタンスにて学習済みモデルをキャッシュしておく
  const loadLearnedModel = async () => {
    const userId: string | null = Browser.getUserIdFromLocalStorage();
    const backEnd = new BackEnd();

    // 学習済みモデルを読み込む
    backEnd.loadLearnedModel(
      userId!,
      // 各要素のkeywordプロパティの値を抽出し、配列を作成する
      keywords.map((item) => item.keyword)
    );
  };

  // ページが表示されたときに実行する関数
  React.useEffect(() => {
    loadLearnedModel();
  }, []);

  return (
    <html lang="ja">
      <head>
        {/* ページのタイトル（タブに表示される） */}
        <title>{title}</title>
        {/* ページの説明文（検索エンジンの結果に表示される） */}
        <meta name="description" content={description} />
      </head>
      <body>
        {/* JavaScriptが無効化されている場合に表示する */}
        <NoScript />
        <Container
          id={"outerContainer"}
          className={`${styles["outer-container"]}`}
        >
          {/* 状態管理（Recoil）のルート */}
          <RecoilRoot>
            {/* ヘッダー */}
            <Header id={"header"}>
              {/* メインタイトル */}
              <MainTitle id={"mainTitle"} className={`${styles["main-title"]}`}>
                {/* トップページへのリンク */}
                <Link href={"/"}>
                  {title.split("_")[0]}&nbsp;
                  <span>{title.split("_")[1]}</span>
                </Link>
              </MainTitle>
            </Header>
            {/* コンテンツ */}
            <MainContainer id={"mainContainer"}>{children}</MainContainer>
            {/* フッター */}
            <Footer id={"footer"}>
              {/* コピーライト */}
              <small id={"copyright"} className={`${styles.copyright}`}>
                &copy;2023&nbsp;HiroHiroPy
              </small>
            </Footer>
            {/* ユーザーIDを管理するコンポーネント */}
            <UserIdManager />
            {/* ロード画面 */}
            <Loader id={"loader"} />
          </RecoilRoot>
        </Container>
      </body>
    </html>
  );
}
