import React from "react";
// オリジナルのコンポーネントをインポート
import MsgBox, {
  Props as MsgBoxProps,
  getInitMsgBoxProps,
  displayAlertMsgBox,
} from "../MsgBox/MsgBox";
// オリジナルのクラスをインポート
import { BackEnd } from "../../_services/backEnd";
import { Browser } from "../../_services/browser";

// ユーザーIDを管理するコンポーネント
export default function UserIdManager(): React.ReactElement {
  // メッセージボックスの状態を管理するためのstate
  const [msgBoxProps, setMsgBoxProps] = React.useState<MsgBoxProps>(
    getInitMsgBoxProps("errMsgBox")
  );
  // ユーザーIDを作成する関数
  const createUserId = async (): Promise<void> => {
    try {
      const backEnd = new BackEnd();
      // APIを叩いてユーザーIDを作成
      const newUserId: string = await backEnd.createUserId();

      // ローカルストレージにユーザーIDを保存
      Browser.setUserIdToLocalStorage(newUserId);
    } catch (error) {
      // メッセージボックスを表示
      displayAlertMsgBox(
        ["ユーザーIDを作成できませんでした。"],
        true,
        msgBoxProps,
        setMsgBoxProps
      );
      // 本番環境以外であればエラーをコンソールに表示
      Browser.consoleWrite(error);
    }
  };

  // 初回ロード時の処理
  React.useEffect(() => {
    // ローカルストレージにユーザーIDが保存されていなければ作成
    if (!Browser.getUserIdFromLocalStorage()) {
      createUserId();
    }
  }, []);

  return <MsgBox {...msgBoxProps} />;
}
