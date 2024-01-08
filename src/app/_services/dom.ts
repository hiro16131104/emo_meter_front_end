// DOM操作を行うクラス
export class Dom {
  // 指定したセレクタの要素を取得する
  public static getElement(selector: string): HTMLElement {
    const element: HTMLElement | null = document.querySelector(selector);

    if (!element)
      throw new Error("指定したセレクタの要素が見つかりませんでした。");
    return element;
  }

  // 指定したセレクタの要素をフォーカスする
  public static focusElement(selector: string): void {
    const element: HTMLElement = this.getElement(selector);
    element.focus();
  }

  // 指定したセレクタの要素がフォーカスされているか否か検証する
  public static isFocusElement(selector: string): boolean {
    const element: HTMLElement = this.getElement(selector);
    return element === document.activeElement;
  }

  // 指定したセレクタの要素をクリックする
  public static clickElement(selector: string): void {
    const element: HTMLElement = this.getElement(selector);
    element.click();
  }

  // 指定したセレクタの要素に値を入力する
  public static inputElement(selector: string, value: string): void {
    const element: HTMLTextAreaElement = this.getElement(
      selector
    ) as HTMLTextAreaElement;
    element.value = value;
  }

  // 指定したセレクタの要素のサイズ（px）を取得する
  public static getElementSize(selector: string): {
    width: number;
    height: number;
  } {
    const element: HTMLElement = this.getElement(selector);
    const rect: DOMRect = element.getBoundingClientRect();

    return { width: rect.width, height: rect.height };
  }
}
