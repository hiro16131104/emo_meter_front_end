import React from "react";
// cssをインポート
import styles from "./ItemLabel.module.scss";

interface Props {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  htmlFor?: string;
}

// テキストラベルを表示するコンポーネント
export default function ItemLabel({
  id,
  className,
  style,
  children,
  htmlFor,
}: Props): React.ReactElement {
  return (
    <label
      id={id}
      className={`${styles["item-label"]} ${className}`}
      style={style}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}
