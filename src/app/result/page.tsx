// クライアントコンポーネント
"use client";

import Link from "next/link";
import React from "react";
// オリジナルのコンポーネントをインポート
import Container from "../_components/Container/Container";
import Button from "../_components/Button/Button";
import Marker from "../_components/Marker/Marker";
import MsgBox, {
  Props as MsgBoxProps,
  getInitMsgBoxProps,
  displayAlertMsgBox,
  displayConfirmMsgBox,
} from "../_components/MsgBox/MsgBox";
import DoughnutChart from "../_components/DoughnutChart/DoughnutChart";
import ItemLabel from "../_components/ItemLabel/ItemLabel";
import XShareButton from "../_components/XShareButton/XShareButton";
// オリジナルのクラスをインポート
import { Config, KeywordsItem } from "../../config/config";
import { Browser } from "../_services/browser";
import { Dom } from "../_services/dom";
import { Result } from "../_services/backEnd";
import { Color } from "../_services/color";
import { Calc } from "../_services/calc";
// cssをインポート
import styles from "./page.module.scss";

interface Frequency {
  keyword: string;
  count: number;
  percent: number;
}
interface Sentence {
  text: string;
  style: React.CSSProperties;
  keyword: string;
  percent: number;
}

// 測定する際に使用するアイテム
const keywords: KeywordsItem[] = Config.page.keywords;

export default function Result(): React.ReactElement {
  // メッセージボックスの状態を管理するためのstate
  const [msgBoxProps, setMsgBoxProps] = React.useState<MsgBoxProps>(
    getInitMsgBoxProps("msgBox")
  );
  // 各キーワードの出現頻度を管理するためのstate
  const [frequencies, setFrequencies] = React.useState<Frequency[]>([]);
  // 文章ごとの測定結果を管理するためのstate
  const [sentences, setSentences] = React.useState<Sentence[]>([]);
  // 測定結果のメッセージを管理するためのstate
  const [resultMsg, setResultMsg] = React.useState<{
    keyword: string;
    msg: string;
    style: React.CSSProperties;
  }>({ keyword: "", msg: "", style: {} });
  // トップページのURLを管理するためのstate（Xのシェアボタンで使用する）
  const [topPageUrl, setTopPageUrl] = React.useState<string | undefined>(
    undefined
  );
  // ページのタイトルを管理するためのstate
  const [pageTitle, setPageTitle] = React.useState<string | undefined>(
    undefined
  );
  // マーカーのスタイル（=チャートのスタイル）
  const colorStyles: React.CSSProperties[] = keywords.map((item) => {
    return {
      background: Color.lightenColor(item.color, 30),
      borderColor: Color.darkenColor(item.color, 30),
    };
  });
  // 遷移ボタンをクリックしたときに実行する関数
  const handleRedirectButtonClick = (event: React.MouseEvent) => {
    // メッセージボックスを表示する
    displayConfirmMsgBox(
      ["トップページへ遷移します。", "よろしいですか？"],
      msgBoxProps,
      setMsgBoxProps,
      () => {
        // トップページへ遷移する（非表示のリンクをクリックする）
        const link = Dom.getElement("#linkTopPage") as HTMLLinkElement;
        link.click();
      }
    );
  };

  // ページが表示されたときに実行する関数
  // 【注意】useStateで状態を更新した後、その更新が反映されるのは次のレンダリングサイクルからになる
  React.useEffect(() => {
    const link = Dom.getElement("#linkTopPage") as HTMLLinkElement;
    const tempResults: Result[] | null = Browser.getResultsFromLocalStorage();
    const tempFrequencies: Frequency[] = [];
    const item = { keyword: "", percent: 0.0 };
    let results: Result[] = [];
    let msgs: string[] = [];
    let msg: string | null = "";
    let color: string = "";
    let style: React.CSSProperties = {};

    // ローカルストレージに測定結果がない場合（直接リンク禁止）
    if (!tempResults) {
      // メインコンテナを取得する
      const container = Dom.getElement("#result") as HTMLDivElement;

      // コンテナを非表示にする
      container.style.display = "none";
      // トップページへ遷移する
      displayAlertMsgBox(
        ["測定結果が見つかりません。", "トップページへ遷移します。"],
        true,
        msgBoxProps,
        setMsgBoxProps,
        () => {
          link.click();
        }
      );
      return;
    }

    // 現在のページのURLから、トップページのURLを作成する
    setTopPageUrl(window.location.href.replace("/result", ""));
    // ページのタイトルを取得する
    setPageTitle(document.title);
    // 直前のif文でnullではないことが保証されている
    results = tempResults;
    // stateを初期化
    setFrequencies([]);
    setSentences([]);

    // 各キーワードの出現頻度を計算する
    keywords.forEach((item) => {
      // キーワードが一致する測定結果を抽出
      const filteredResults = results.filter((result) => {
        return result.keyword === item.keyword;
      });
      const frequency: Frequency = {
        keyword: item.keyword,
        // 出現回数
        count: filteredResults.length,
        // 出現率
        percent: (filteredResults.length / results.length) * 100,
      };
      // stateを更新
      setFrequencies((frequencies) => [...frequencies, frequency]);
      // 後の処理で使用する
      tempFrequencies.push(frequency);
    });

    // 最も出現率の高いキーワードを抽出
    tempFrequencies.forEach((frequency) => {
      // 前のループのpercentよりも大きい場合
      if (frequency.percent > item.percent) {
        item.keyword = frequency.keyword;
        item.percent = frequency.percent;
      }
    });

    // どの文からも感情が測定できなかった場合
    if (!item.keyword) {
      // トップページへ遷移する
      displayAlertMsgBox(
        [
          "文章から感情が読み取れません。",
          "違う文章で試してください。",
          "トップページへ遷移します。",
        ],
        true,
        msgBoxProps,
        setMsgBoxProps,
        () => {
          link.click();
        }
      );
      return;
    }

    // 最も出現率の高いキーワードに対応するメッセージを抽出
    msgs = keywords.find((x) => {
      return x.keyword === item.keyword;
    })?.msgs as string[];
    // 最も出現率の高いキーワードに対応する色を抽出
    color = keywords.find((x) => {
      return x.keyword === item.keyword;
    })?.color as string;
    // 測定メッセージのスタイルを作成
    style = {
      // 色を薄くする
      borderColor: Color.lightenColor(color, 70),
      background: Color.lightenColor(color, 70),
    };
    msg = Browser.getResultMsgFromLocalStorage();

    // stateを更新
    // ローカルストレージに保存されているメッセージがある場合
    if (msg) {
      // ローカルストレージに保存されているメッセージを表示する
      setResultMsg({ keyword: item.keyword, msg: msg, style: style });
    } else {
      // 測定結果のメッセージをランダムに表示する
      const randomIndex = Calc.getRandomInt(0, msgs.length - 1);

      setResultMsg({
        keyword: item.keyword,
        msg: msgs[randomIndex],
        style: style,
      });
      // ローカルストレージに保存する
      Browser.setResultMsgToLocalStorage(msgs[randomIndex]);
    }

    // 測定結果を文章形式で表示するために整形する
    results.forEach((result) => {
      // 測定結果に対応する色を抽出
      let color = keywords.find((item) => {
        return item.keyword === result.keyword;
      })?.color as string;
      let sentence = {} as Sentence;

      // 色を薄くする
      color = color ? Color.lightenColor(color, 60) : "trasparent";
      sentence = {
        text: result.sentence,
        keyword: result.keyword,
        // 蛍光ペンのようなスタイルを作成
        style: {
          background: `linear-gradient(transparent 50%, ${color} 50%)`,
        },
        // マッチ率（類似率）
        percent: result.similarity * 100,
      };
      // state（配列）の末尾に追加
      setSentences((sentences) => [...sentences, sentence]);
    });
  }, []);

  return (
    <React.Fragment>
      <Container id={"result"} className={`${styles.container} fade-in-base`}>
        {/* このページのタイトルを表示するエリア */}
        <Container
          id={"titleContainer"}
          className={`${styles["title-container"]}`}
        >
          <Container className={`${styles["title-container-left"]}`}>
            {""}
          </Container>
          {/* このページのタイトル */}
          <Container className={`${styles["title-container-center"]}`}>
            <h2>{"測定結果"}</h2>
          </Container>
          {/* Xのシェアボタン */}
          <Container className={`${styles["title-container-right"]}`}>
            <XShareButton
              id={"xShareButton"}
              text={`【測定結果】\n${resultMsg.msg}`}
              url={topPageUrl}
              hashtags={pageTitle}
              lang={"en"}
              size={"large"}
            />
          </Container>
        </Container>
        {/* コンテンツを表示するエリア */}
        <Container
          id={"contentsContainer"}
          className={`${styles["contents-container"]}`}
        >
          {/* 測定結果をチャート形式で表示するエリア */}
          <Container
            id={"chartContainer"}
            className={`${styles["chart-container"]}`}
          >
            {/* 測定結果を表示するドーナツチャート */}
            <DoughnutChart
              id={"chart"}
              labels={keywords.map((item) => {
                return item.keyword;
              })}
              data={frequencies.map((frequency) => {
                return Calc.floor(frequency.percent, 1);
              })}
              bgColors={colorStyles.map((colorStyle) => {
                return colorStyle.background as string;
              })}
              borderColor={colorStyles.map((colorStyle) => {
                return colorStyle.borderColor as string;
              })}
              msg={resultMsg.keyword}
            />
            {/* ドーナツチャートの説明を表示するエリア */}
            <Container
              id={"tableContainer"}
              className={`${styles["table-container"]}`}
            >
              {/* ヘッダーなしテーブル */}
              <table className={`${styles["headerless-table"]}`}>
                <tbody>
                  {keywords.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {/* チャートの色と対応するマーカーを表示 */}
                          <Marker
                            className={`${styles.marker}`}
                            style={colorStyles[index]}
                          />
                        </td>
                        {/* 測定時に使用したキーワードを表示（各色が何を示しているか） */}
                        <td>{item.keyword}</td>
                        {/* 出現率を表示 */}
                        <td className={`${styles["text-align-right"]}`}>
                          <span className={`${styles["margin-left-5"]}`}>
                            {/* 小数点第1位まで表示 */}
                            {frequencies.length > 0
                              ? `${Calc.floor(
                                  frequencies[index].percent,
                                  1
                                ).toFixed(1)}%`
                              : "0.0%"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Container>
          </Container>
          {/* 測定メッセージを表示するエリア */}
          <Container
            id={"resultMsgContainer"}
            className={`${styles["result-msg-container"]}`}
          >
            <ItemLabel
              id={"resultMsg"}
              className={`${styles["result-msg"]}`}
              style={resultMsg.style}
            >
              {resultMsg.msg}
            </ItemLabel>
          </Container>
          {/* 測定結果を文章形式で表示するエリア */}
          <Container
            id={"sentencesContainer"}
            className={`${styles["sentences-container"]}`}
          >
            <ItemLabel id={"sentences"} className={`${styles.sentences}`}>
              <table className={`${styles["headerless-table"]}`}>
                <tbody>
                  {sentences.map((item, index) => {
                    return (
                      <tr key={index}>
                        {/* 小数点第1位まで表示 */}
                        <td className={`${styles.percent}`}>
                          {item.percent > 0
                            ? `${Calc.floor(item.percent, 1).toFixed(1)}%マッチ`
                            : "マッチなし"}
                        </td>
                        <td className={`${styles.sentence}`}>
                          <span style={item.style}>{item.text}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ItemLabel>
          </Container>
        </Container>
        <Container id={"buttons"} className={`${styles["button-container"]}`}>
          {/* トップページへ遷移するためのボタン */}
          <Button
            id={"redirectButton"}
            className={`${styles["redirect-button"]}`}
            variant={"default"}
            onClick={handleRedirectButtonClick}
          >
            {"トップページへ戻る"}
          </Button>
        </Container>
      </Container>
      {/* トップページへ遷移するためのリンク（非表示） */}
      <Link id={"linkTopPage"} href={"/"} className={`${styles.link}`}>
        {"トップページへ"}
      </Link>
      {/* ポップアップ表示するメッセージボックス */}
      <MsgBox {...msgBoxProps}></MsgBox>
    </React.Fragment>
  );
}
