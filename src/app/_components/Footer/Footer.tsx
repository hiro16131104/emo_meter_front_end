import React from "react";
// オリジナルのコンポーネントをインポート
import Container from "../Container/Container";
// cssをインポート
import styles from "./Footer.module.scss";

interface Props {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

// フッターを表示するコンポーネント
export default function Footer({
  children,
  id,
  className,
}: Props): React.ReactElement {
  return (
    <footer className={`${styles.footer}`}>
      <Container
        id={id}
        className={`${styles.container} ${styles["fade-up"]} ${className}`}
      >
        {children}
      </Container>
    </footer>
  );
}
