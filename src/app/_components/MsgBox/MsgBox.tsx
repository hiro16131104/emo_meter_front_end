import React from "react";
// オリジナルのクラスをインポート
import Container from "../Container/Container";
import Button from "../Button/Button";
// cssをインポート
import styles from "./MsgBox.module.scss";

export interface Props {
  id?: string;
  className?: string;
  children: React.ReactNode;
  isDisplay: boolean;
  onOkButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCancelButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// 初期値のプロパティを取得する関数
export const getInitMsgBoxProps = (id?: string): Props => {
  return {
    id: id,
    className: undefined,
    children: <></>,
    isDisplay: false,
    onOkButtonClick: () => {},
    onCancelButtonClick: () => {},
  };
};

// メッセージボックスを閉じる関数
const closeMsgBox = (
  state: Props,
  setState: React.Dispatch<React.SetStateAction<Props>>
): void => {
  setState({
    ...state,
    children: <></>,
    isDisplay: false,
    onOkButtonClick: () => {},
    onCancelButtonClick: () => {},
  });
};

// アラート用のメッセージボックスを表示する関数
export const displayAlertMsgBox = (
  msgs: string[],
  isError: boolean = false,
  state: Props,
  setState: React.Dispatch<React.SetStateAction<Props>>,
  onOkButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
): void => {
  // メッセージを表示する要素を作成
  const children: React.ReactNode = msgs.map((msg) => {
    return <p className={isError ? styles["error-msg"] : undefined}>{msg}</p>;
  });

  // メッセージボックスを表示
  setState({
    ...state,
    children: children,
    isDisplay: true,
    onOkButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onOkButtonClick) onOkButtonClick(event);
      closeMsgBox(state, setState);
    },
    onCancelButtonClick: undefined,
  });
};

// 確認用のメッセージボックスを表示する関数
export const displayConfirmMsgBox = (
  msgs: string[],
  state: Props,
  setState: React.Dispatch<React.SetStateAction<Props>>,
  onOkButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void
): void => {
  // メッセージを表示する要素を作成
  const children: React.ReactNode = msgs.map((msg) => {
    return <p>{msg}</p>;
  });

  // メッセージボックスを表示
  setState({
    ...state,
    children: children,
    isDisplay: true,
    onOkButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      onOkButtonClick(event);
      closeMsgBox(state, setState);
    },
    onCancelButtonClick: () => {
      closeMsgBox(state, setState);
    },
  });
};

// メッセージボックスを表示するコンポーネント
// isVisibleプロパティは子要素から変更できないので、親要素から変更すること。
export default function MsgBox({
  id,
  className,
  children,
  isDisplay,
  onOkButtonClick,
  onCancelButtonClick,
}: Props): React.ReactElement {
  // 表示/非表示を切り替えるスタイル
  const displayStyle: React.CSSProperties = {
    display: isDisplay ? "flex" : "none",
  };
  // OKボタンをクリックしたときの処理
  const handleOkButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onOkButtonClick(event);
  };
  // キャンセルボタンをクリックしたときの処理
  const handleCancelButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    onCancelButtonClick!(event);
  };

  return (
    <React.Fragment>
      {/* マウス操作をブロックするためのシールド */}
      <Container
        id={id ? `${id}Shield` : undefined}
        className={`${styles.shield} fade-in-fast`}
        style={displayStyle}
      >
        {""}
      </Container>
      {/* ダイアログボックス */}
      <Container
        id={id ? `${id}Dialog` : undefined}
        className={`${styles.dialog} fade-in-fast ${className}`}
        style={displayStyle}
      >
        {/* 表示するメッセージ等 */}
        <Container className={styles.contents}>{children}</Container>
        {/* "OK"ボタンと"キャンセル"ボタン */}
        <Container className={styles.buttons}>
          <Button
            variant={"default"}
            onClick={(event) => {
              handleOkButtonClick(event);
            }}
          >
            {"OK"}
          </Button>
          {/* "キャンセル"ボタンはキャンセルボタンのクリック */}
          {onCancelButtonClick && (
            <Button
              variant={"outlined"}
              onClick={(event) => {
                handleCancelButtonClick(event);
              }}
            >
              {"キャンセル"}
            </Button>
          )}
        </Container>
      </Container>
    </React.Fragment>
  );
}
