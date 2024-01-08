import React from "react";
// cssをインポート
import styles from "./Marker.module.scss";

interface Props {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

// マーカー（丸いアイコン）を表示するコンポーネント
export default function Marker({
  id,
  className,
  style,
}: Props): React.ReactElement {
  return (
    <div
      id={id}
      className={`${styles.marker} ${className}`}
      style={style}
    ></div>
  );
}
