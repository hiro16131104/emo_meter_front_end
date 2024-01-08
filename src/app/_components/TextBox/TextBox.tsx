import React from "react";
// cssをインポート
import styles from "./TextBox.module.scss";

interface Props {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  onInput?: (event: React.FormEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => void;
}

// テキストボックスを表示するコンポーネント
export default function TextBox({
  id,
  className,
  style,
  placeholder,
  disabled,
  maxLength,
  onInput,
  onBlur,
  onClick,
}: Props): React.ReactElement {
  return (
    <textarea
      id={id}
      className={`${styles["text-box"]} ${className}`}
      style={style}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      onInput={onInput}
      onBlur={onBlur}
      onClick={onClick}
    />
  );
}
