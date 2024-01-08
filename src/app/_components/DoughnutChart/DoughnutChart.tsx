import React from "react";
import Chart from "chart.js/auto";
// オリジナルのコンポーネントをインポート
import Container from "../Container/Container";
// cssをインポート
import styles from "./DoughnutChart.module.scss";

interface Props {
  id?: string;
  className?: string;
  labels: string[];
  data: number[];
  bgColors: string[];
  borderColor: string[];
  msg?: string;
}

// ドーナツチャートを表示するコンポーネント
export default function DoughnutChart({
  id,
  className,
  labels,
  data,
  bgColors,
  borderColor,
  msg,
}: Props): React.ReactElement {
  // canvas要素を参照するためのref
  const chartRef = React.useRef<HTMLCanvasElement>(null);
  // span要素を参照するためのref
  const msgRef = React.useRef<HTMLSpanElement>(null);
  // メッセージ（span要素）のサイズを保持するためのstate
  const [msgSize, setMsgSize] = React.useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  // メッセージ（span要素）のスタイル（ドーナツチャートの中央に表示する）
  const msgStyle: React.CSSProperties = {
    position: "absolute",
    top: `calc((100% - ${msgSize.height}px}) / 2)`,
    left: `calc((100% - ${msgSize.width}px}) / 2)`,
  };

  // ページが表示されたときに実行する関数
  React.useEffect(() => {
    let chartContext: CanvasRenderingContext2D;
    let doughtnutChart: Chart<"doughnut", number[], string>;

    // canvas要素が見つからない場合は処理を抜ける
    if (!chartRef || !chartRef.current) return;
    // span要素が見つからない場合は処理を抜ける
    if (!msgRef || !msgRef.current) return;

    // 2次元描画コンテキストを取得する
    chartContext = chartRef.current.getContext("2d")!;
    // チャートを描画する
    doughtnutChart = new Chart(chartContext, {
      type: "doughnut",
      data: {
        // マウスをホバーした際に表示するラベル
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: bgColors,
            borderWidth: 0.5,
            borderColor: borderColor,
          },
        ],
      },
      options: {
        plugins: {
          // チャートの上部にラベルを表示しない
          legend: {
            display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
        },
      },
    });
    // メッセージ（span要素）のサイズを取得する
    setMsgSize({
      width: msgRef.current.clientWidth,
      height: msgRef.current.clientHeight,
    });

    // コンポーネントのアンマウント時に実行する関数
    return () => {
      // チャートを破棄する
      if (doughtnutChart) doughtnutChart.destroy();
    };
  }, [data]);

  return (
    <Container id={id} className={`${styles.container} ${className}`}>
      {/* ドーナツチャート */}
      <canvas ref={chartRef}></canvas>
      {/* チャートの中央に表示するメッセージ */}
      <span className={`${styles.msg}`} style={msgStyle} ref={msgRef}>
        {msg}
      </span>
    </Container>
  );
}
