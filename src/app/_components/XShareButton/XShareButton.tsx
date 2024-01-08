import Link from "next/link";
import React from "react";

interface Props {
  id?: string;
  className?: string;
  text?: string;
  url?: string;
  hashtags?: string;
  size?: string;
  lang?: string;
}

// Xのシェアボタンを作成するための外部スクリプト
const SRC = "https://platform.twitter.com/widgets.js";
const HREF = "https://twitter.com/share?ref_src=twsrc%5Etfw";

export default function XShareButton({
  id,
  className,
  text,
  url,
  hashtags,
  size,
  lang,
}: Props) {
  // scriptタグの読み込みが完了したかどうかの状態を管理する
  const [scriptLoaded, setScriptLoaded] = React.useState(false);
  const linkStyle: React.CSSProperties = {
    display: scriptLoaded ? "block" : "none",
  };

  React.useEffect(() => {
    // scriptタグを作成する
    const script = document.createElement("script");

    // scriptタグの属性を設定する
    script.src = SRC;
    script.async = true;
    // scriptタグの読み込みが完了した時の処理
    script.onload = () => {
      setScriptLoaded(true);
    };
    // scriptタグの読み込みに失敗した時の処理
    script.onerror = () => {
      setScriptLoaded(false);
    };
    // scriptタグをbodyタグの最後に追加する
    document.body.appendChild(script);

    // コンポーネントがアンマウントされる時に実行する関数を返す
    return () => {
      // scriptタグを削除する
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Link
      id={id}
      href={HREF}
      className={`twitter-share-button ${className}`}
      style={linkStyle}
      data-show-count={false}
      data-text={text ? `${text}\n\n` : undefined}
      data-url={url ? `${url}\n` : undefined}
      data-hashtags={hashtags}
      data-size={size}
      data-lang={lang}
    >
      Xにポスト
    </Link>
  );
}
