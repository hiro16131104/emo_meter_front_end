import React from "react";

// JavaScriptが無効になっている場合にメッセージを表示するコンポーネント（bodyタグの一番上に配置する）
export default function NoScript(): React.ReactElement {
  return (
    <noscript>
      JavaScriptが無効になっています。JavaScriptを有効にしてください。
    </noscript>
  );
}
