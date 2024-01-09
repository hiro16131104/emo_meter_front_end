// クライアントコンポーネント
"use client";

import Link from "next/link";
import React from "react";
// オリジナルのコンポーネントをインポート
import Container from "./_components/Container/Container";
import Fluid from "./_components/Fluid/Fluid";
// オリジナルのクラスをインポート
import { Dom } from "./_services/dom";
import { Browser } from "./_services/browser";
// cssをインポート
import styles from "./page.module.scss";

// トップページを表示するコンポーネント
export default function Home(): React.ReactElement {
  // fluid（svg）の横幅を取得するためのstate
  const [fluidLength, setFluidLength] = React.useState<number>(0);
  // fluid横幅に応じてintroのサイズを変更
  const introStyle: React.CSSProperties = {
    width: `${fluidLength * 0.7}px`,
    height: `${fluidLength * 0.7}px`,
  };
  // リンクを参照するためのref
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  // fluidのサイズを更新する関数
  const updateFluidSize = (): void => {
    // fluidのサイズを取得
    const fluidSize: { width: number; height: number } =
      Dom.getElementSize("#fluid");
    // width,heightのうち小さい方を取得
    const length: number =
      fluidSize.width < fluidSize.height ? fluidSize.width : fluidSize.height;

    // stateを更新
    setFluidLength(length);
  };
  // introをクリックした時もリンクをクリックしたことにする関数
  const handleIntroClick = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    linkRef.current?.click();
  };

  // 初回ロード時の処理
  React.useEffect(() => {
    // ページが読み込まれた時にfluidのサイズを更新
    updateFluidSize();
    // ページのサイズが変更された時にfluidのサイズを更新
    window.addEventListener("resize", updateFluidSize);
    // ローカルストレージに保存されている測定結果を削除
    Browser.removeResultsFromLocalStorage();
    Browser.removeResultMsgFromLocalStorage();

    // コンポーネントがアンマウントされる時にイベントリスナーを削除
    return () => window.removeEventListener("resize", updateFluidSize);
  }, []);

  return (
    <React.Fragment>
      <Container id={"home"} className={`${styles.container} fade-in-base`}>
        {/* 流体（背景） */}
        <Fluid id={"fluid"} className={styles.fluid}></Fluid>
        <Container
          id={"intro"}
          className={styles.intro}
          style={introStyle}
          onClick={handleIntroClick}
        >
          <h2>{"ようこそ"}</h2>
          <p>
            {
              "SNS投稿前に感情のバランスをチェックし、より良いコミュニケーションを目指しましょう。"
            }
          </p>
          {/* ハイパーリンク */}
          <Link href={"/sentence"} className={styles.link} ref={linkRef}>
            {">> Tap To Start"}
          </Link>
        </Container>
      </Container>
    </React.Fragment>
  );
}
