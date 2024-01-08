import React from "react";
// オリジナルのコンポーネントをインポート
import Container from "../Container/Container";
// cssをインポート
import styles from "./MainContainer.module.scss";

interface Props {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

// コンテンツ領域を表示するコンポーネント
export default function MainContainer({
  children,
  id,
  className,
}: Props): React.ReactElement {
  return (
    <main className={`${styles.main}`}>
      <Container id={id} className={`${styles.container} fade-in-base ${className}`}>
        {children}
      </Container>
    </main>
  );
}
