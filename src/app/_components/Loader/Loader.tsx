import React from "react";
import { useRecoilValue } from "recoil";
// オリジナルのコンポーネントをインポート
import Container from "../Container/Container";
// 状態管理（Recoil）のアトムをインポート
import { isLoadingState } from "../../_atoms/state";
// cssをインポート
import styles from "./Loader.module.scss";

interface Props {
  id?: string;
  className?: string;
}

// ロード画面を表示するコンポーネント
export default function Loader({ id, className }: Props): React.ReactElement {
  // ロード中であればtrue
  const isLoading: boolean = useRecoilValue(isLoadingState);
  // ロード中であればロード画面を表示する
  const containerStyle: React.CSSProperties = {
    display: isLoading ? "flex" : "none",
  };

  return (
    <Container
      id={id}
      className={`${styles.container} fade-in-fast ${className}`}
      style={containerStyle}
    >
      <div className={`${styles.loader}`}></div>
      <p className={`${styles.text}`}>{"Now Loading..."}</p>
    </Container>
  );
}
