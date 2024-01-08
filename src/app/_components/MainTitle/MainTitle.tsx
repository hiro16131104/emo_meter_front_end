import React from "react";
// オリジナルのコンポーネントをインポート
import Container from "../Container/Container";
// cssをインポート
import styles from "./MainTitle.module.scss";

interface Props {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

// メインタイトルを表示するコンポーネント
export default function MainTitle({
  children,
  id,
  className,
}: Props): React.ReactElement {
  return (
    <Container id={id} className={`${styles["main-title"]} ${className}`}>
      <h1>{children}</h1>
    </Container>
  );
}
