// クライアントコンポーネント
"use client";

import { useRecoilState } from "recoil";
import Link from "next/link";
import React from "react";
// オリジナルのコンポーネントをインポート
import Container from "../_components/Container/Container";
import Button from "../_components/Button/Button";
import TextBox from "../_components/TextBox/TextBox";
import MsgBox, {
  Props as MsgBoxProps,
  getInitMsgBoxProps,
  displayAlertMsgBox,
  displayConfirmMsgBox,
} from "../_components/MsgBox/MsgBox";
import HiddenFileInput from "../_components/HiddenFileInput/HiddenFileInput";
// オリジナルのクラスをインポート
import { Config, KeywordsItem } from "../../config/config";
import { Dom } from "../_services/dom";
import { Browser } from "../_services/browser";
import { Calc } from "../_services/calc";
import {
  BackEnd,
  SimilarityResponse,
  SimilarKeywordResponse,
} from "../_services/backEnd";
// 状態管理（Recoil）のアトムをインポート
import { isLoadingState } from "../_atoms/state";
// cssをインポート
import styles from "./page.module.scss";

// 対応しているファイル形式
const extensions: string[] = Config.sentencePage.extensions;
// ファイルサイズの上限（単位: Byte）
const maxFileSize: number = Config.sentencePage.maxFileSize;
// 文章の最大文字数
const maxWordCount: number = Config.sentencePage.maxWordCount;
// 例文
const examples: string[] = Config.sentencePage.examples;
// 測定する際に使用するアイテム
const keywords: KeywordsItem[] = Config.page.keywords;

// 文章を入力するページを表示するコンポーネント
export default function Sentence(): React.ReactElement {
  // ロード中であればtrue → ロード画面を表示する
  const [isLoading, setIsLoading] = useRecoilState<boolean>(isLoadingState);
  // メッセージボックスの状態を管理するためのstate
  const [msgBoxProps, setMsgBoxProps] = React.useState<MsgBoxProps>(
    getInitMsgBoxProps("msgBox")
  );
  // テキストボックスの文字数を管理するためのstate
  const [wordInfo, setWordInfo] = React.useState({
    count: 0,
    isError: false,
  });
  // テキストボックスの入力を監視する関数
  const handleTextBoxInput = (
    event?: React.FormEvent<HTMLTextAreaElement>
  ): void => {
    const explanation: HTMLElement = Dom.getElement("#explanation");
    const textBox: HTMLTextAreaElement = Dom.getElement(
      "#textBox"
    ) as HTMLTextAreaElement;
    // テキストボックスに入力された文字数
    const textLength: number = textBox.value.length;

    // 文章の文字数を更新する
    setWordInfo({
      count: textLength,
      isError: textLength > maxWordCount,
    });
    // 何も文字が入力されていない場合は説明文を表示する
    explanation.style.visibility =
      textLength === 0 && !Dom.isFocusElement("#textBox")
        ? "visible"
        : "hidden";
  };
  // テキストボックスからフォーカスが外れたときの処理
  const handleTextBoxBlur = (
    event: React.FocusEvent<HTMLTextAreaElement>
  ): void => {
    // テキストボックスの入力を監視する関数を実行する
    handleTextBoxInput();
  };
  const handleTextBoxClick = (
    event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>
  ): void => {
    // テキストボックスの入力を監視する関数を実行する
    handleTextBoxInput();
  };
  // 説明文をクリックしたときもテキストボックスをクリックしたことにする関数
  const handleExplanationClick = (
    event: React.MouseEvent<HTMLElement>
  ): void => {
    event.preventDefault();
    // テキストボックスにフォーカスを当てる
    Dom.focusElement("#textBox");
    // テキストボックスの入力を監視する関数を実行する
    handleTextBoxInput();
  };
  // 削除ボタンをクリックしたときの処理
  const handleDeleteButtonClick = (
    event: React.MouseEvent<HTMLElement>
  ): void => {
    // テキストボックスの値を削除する
    Dom.inputElement("#textBox", "");
    // テキストボックスの入力を監視する関数を実行する
    handleTextBoxInput();
  };
  // "例文を使う"ボタンをクリックしたときの処理
  const handleExampleButtonClick = (
    event: React.MouseEvent<HTMLElement>
  ): void => {
    displayConfirmMsgBox(
      ["例文を使いますか？"],
      msgBoxProps,
      setMsgBoxProps,
      () => {
        // 例文の中からランダムに1つ選択する
        const index: number = Calc.getRandomInt(0, examples.length - 1);

        // テキストボックスに例文を入力する
        Dom.inputElement("#textBox", examples[index]);
        // テキストボックスの入力を監視する関数を実行する
        handleTextBoxInput();
      }
    );
  };
  // 最終アクセス日時を更新する関数
  const updateLastAccessedAt = async (userId: string): Promise<void> => {
    try {
      const backEnd = new BackEnd();
      // 最終アクセス日時を更新する
      await backEnd.updateLastAccessedAt(userId);
    } catch (error) {
      // ローカルストレージからユーザーIDを削除する
      Browser.removeUserIdFromLocalStorage();
      // メッセージボックスを表示
      displayAlertMsgBox(
        ["ユーザーIDが見つかりません。", "ページを更新してください。"],
        true,
        msgBoxProps,
        setMsgBoxProps
      );
      // 本番環境以外であればエラーをコンソールに表示
      Browser.consoleWrite(error);
      // ロード画面を非表示にする
      setIsLoading(false);
      // 処理を抜ける
      return;
    }
  };
  // ファイルをアップロードするボタンをクリックしたときの処理
  const handleFileUploadButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    // ファイルをアップロードする隠しボタンをクリックする
    Dom.clickElement("#hiddenFileInput");
  };
  // ファイルをアップロードする隠しボタンの値が変更されたときの処理
  const handleHiddenFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file: File | null = event.target.files ? event.target.files[0] : null;
    const userId: string | null = Browser.getUserIdFromLocalStorage();
    const backEnd = new BackEnd();
    let extension: string;
    let msgs: string[] = [];

    // ファイルが選択されていない場合は処理を抜ける
    if (!file) return;
    // ファイルの拡張子を取得
    extension = file.name.split(".").slice(-1)[0].toLowerCase();

    // 拡張子が非対応の場合
    if (!extensions.includes(extension)) {
      msgs = [
        "対応していないファイル形式です。",
        "他のファイルを選んでください。",
      ];
    }
    // ファイルサイズが大きすぎる場合
    else if (file.size > maxFileSize) {
      msgs = [
        "ファイルサイズが大きすぎます。",
        "他のファイルを選んでください。",
      ];
    }
    // ローカルストレージにユーザーIDが保存されていない場合
    else if (!userId) {
      msgs = ["ユーザーIDが見つかりません。", "ページを更新してください。"];
    }

    // 検証エラーの場合
    if (msgs.length > 0) {
      // メッセージボックスを表示
      displayAlertMsgBox(msgs, true, msgBoxProps, setMsgBoxProps);
      // 処理を抜ける
      return;
    }

    // ロード画面を表示する
    setIsLoading(true);
    // 最終アクセス日時を更新する
    updateLastAccessedAt(userId!);

    try {
      // ファイルを読み込む
      const text: string = await backEnd.readDocumentFile(userId!, file);
      // テキストボックスにファイルの内容を入力する
      Dom.inputElement("#textBox", text);
      // テキストボックスの入力を監視する関数を実行する
      handleTextBoxInput();
      // メッセージボックスを表示
      displayAlertMsgBox(
        ["ファイルの読み込みが完了しました。"],
        false,
        msgBoxProps,
        setMsgBoxProps
      );
    } catch (error) {
      // メッセージボックスを表示
      displayAlertMsgBox(
        ["ファイルの読み込みに失敗しました。"],
        true,
        msgBoxProps,
        setMsgBoxProps
      );
      // 本番環境以外であればエラーをコンソールに表示
      Browser.consoleWrite(error);
      // 処理を抜ける
      return;
    } finally {
      // input要素にあるファイルを削除する
      event.target.value = "";
      // ロード画面を非表示にする
      setIsLoading(false);
    }
  };
  // 測定を実行するボタンをクリックしたときの処理
  const handleExecuteButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    const userId: string | null = Browser.getUserIdFromLocalStorage();
    const textBox: HTMLTextAreaElement = Dom.getElement(
      "#textBox"
    ) as HTMLTextAreaElement;
    const backEnd = new BackEnd();
    let msgs: string[] = [];

    // テキストボックスに値が入力されていない場合
    if (!textBox.value) {
      msgs = ["文章が入力されていません。"];
    }
    // 文章の文字数が多すぎる場合
    else if (textBox.value.length > maxWordCount) {
      msgs = [`文章が長すぎます（${maxWordCount.toLocaleString()}文字以内）。`];
    }
    // ローカルストレージにユーザーIDが保存されていない場合
    else if (!userId) {
      msgs = ["ユーザーIDが見つかりません。", "ページを更新してください。"];
    }

    // 検証エラーの場合
    if (msgs.length > 0) {
      // メッセージボックスを表示
      displayAlertMsgBox(msgs, true, msgBoxProps, setMsgBoxProps);
      // 処理を抜ける
      return;
    }

    // ロード画面を表示する
    setIsLoading(true);
    // 最終アクセス日時を更新する
    updateLastAccessedAt(userId!);

    try {
      const link = Dom.getElement("#linkResultPage") as HTMLLinkElement;
      // 測定を実行する1（文章とキーワードの類似度を計算する）
      const response1: SimilarityResponse = await backEnd.calculateSimilarity(
        userId!,
        // 各要素のkeywordプロパティの値を抽出し、配列を作成する
        keywords.map((item) => item.keyword),
        textBox.value
      );
      // 測定を実行する2（各文章に対して類似度が最も高いキーワードを決定する）
      const response2: SimilarKeywordResponse =
        await backEnd.determineSimilarKeyword(
          userId!,
          response1.sentences,
          response1.similarInfomations
        );
      // ローカルストレージに測定結果を保存する
      Browser.setResultsToLocalStorage(response2.results);
      // 測定結果ページへ遷移する
      link.click();
    } catch (error) {
      // メッセージボックスを表示
      displayAlertMsgBox(
        ["測定に失敗しました（エラー）。"],
        true,
        msgBoxProps,
        setMsgBoxProps
      );
      // 本番環境以外であればエラーをコンソールに表示
      Browser.consoleWrite(error);
      // 処理を抜ける
      return;
    } finally {
      // ロード画面を非表示にする
      setIsLoading(false);
    }
  };

  // ページが表示されたときに実行する関数
  React.useEffect(() => {
    // テキストボックスの入力を監視する関数を実行する（ブラウザの戻るボタンで戻ってきたときに備えて）
    handleTextBoxInput();
  }, []);

  return (
    <React.Fragment>
      <Container id={"sentence"} className={`${styles.container} fade-in-base`}>
        {/* ユーザーが入力した値を受け取るテキストボックス */}
        <TextBox
          id={"textBox"}
          className={`${styles["text-box"]}`}
          onInput={handleTextBoxInput}
          onBlur={handleTextBoxBlur}
          onClick={handleTextBoxClick}
        />
        {/* 説明文を表示するエリア（placeholderの代わりにテキストボックスの上に表示する） */}
        <Container
          id={"explanation"}
          className={`${styles.explanation}`}
          onClick={handleExplanationClick}
        >
          <h2>{"測定したい文章を入力してください（コピペでもOK）。"}</h2>
          <pre>
            {"下のボタンをクリックして、ファイルから文章を読み込むこともできます。\n" +
              `対応しているファイル形式は、${extensions.join("、")}です。`}
          </pre>
        </Container>
        <Container id={"delete"} className={`${styles.delete}`}>
          {/* テキストボックスの値を削除するボタン */}
          <Container
            id={"deleteButton"}
            className={`${styles["delete-button"]}`}
            onClick={handleDeleteButtonClick}
          >
            {"×"}
          </Container>
        </Container>
        <Container id={"example"} className={`${styles.example}`}>
          {/* 例文を表示するボタン */}
          <span
            id={"exampleButton"}
            className={`${styles["example-button"]}`}
            onClick={handleExampleButtonClick}
          >
            {"例文を使う"}
          </span>
        </Container>
        <Container id={"wordCount"} className={`${styles["word-count"]}`}>
          {/* 文章の文字数を表示する */}
          <span
            className={`${wordInfo.isError ? styles["error-msg"] : undefined}`}
          >
            {`${wordInfo.count.toLocaleString()} / ${maxWordCount.toLocaleString()}文字`}
          </span>
        </Container>
        <Container id={"buttons"} className={`${styles["button-container"]}`}>
          {/* ファイルをアップロードするボタン */}
          <Button
            id={"fileUploadButton"}
            className={`${styles["file-upload-button"]}`}
            variant={"outlined"}
            onClick={handleFileUploadButtonClick}
          >
            {"ファイルから読み込む"}
            {/* ファイルをアップロードする隠しボタン */}
            <HiddenFileInput
              id={"hiddenFileInput"}
              accept={extensions.map((extension) => `.${extension}`).join(",")}
              onChange={handleHiddenFileInputChange}
            />
          </Button>
          {/* 測定を実行するボタン */}
          <Button
            id={"executeButton"}
            className={`${styles["execute-button"]}`}
            variant={"default"}
            onClick={handleExecuteButtonClick}
          >
            {"測定する"}
          </Button>
          {/* 測定結果ページへ遷移するためのリンク（非表示） */}
          <Link
            id={"linkResultPage"}
            href={"/result"}
            className={`${styles.link}`}
          >
            {"測定結果ページへ"}
          </Link>
        </Container>
      </Container>
      {/* ポップアップ表示するメッセージボックス */}
      <MsgBox {...msgBoxProps}></MsgBox>
    </React.Fragment>
  );
}
