import React from "react";
// オリジナルのコンポーネントをインポート
import Container from "../Container/Container";
// cssをインポート
import styles from "./Header.module.scss";

interface Props {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

// ヘッダーを表示するコンポーネント
export default function Header({
  children,
  id,
  className,
}: Props): React.ReactElement {
  return (
    <header className={`${styles.header}`}>
      <Container
        id={id}
        className={`${styles.container} ${styles["fade-down"]} ${className}`}
      >
        {children}
      </Container>
    </header>
  );
}
