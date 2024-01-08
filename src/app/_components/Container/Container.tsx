import React from "react";
// cssをインポート
import styles from "./Container.module.scss";

interface Props {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

// コンテナーを表示するコンポーネント
export default function Container({
  children,
  id,
  className,
  style,
  onClick,
}: Props): React.ReactElement {
  return (
    <div
      id={id}
      className={`${styles.container} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
