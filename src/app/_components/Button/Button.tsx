import React from "react";
// cssをインポート
import styles from "./Button.module.scss";

interface Props {
  children: React.ReactNode;
  id?: string;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "outlined";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// ボタンの種類ごとのCSSクラス名
const CLASS_NAMES = {
  default: styles.default,
  outlined: styles.outlined,
};

// ボタンを表示するコンポーネント
export default function Button({
  children,
  id,
  className,
  disabled,
  variant = "default",
  onClick,
}: Props): React.ReactElement {
  return (
    <button
      id={id}
      className={`${styles.button} ${CLASS_NAMES[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
