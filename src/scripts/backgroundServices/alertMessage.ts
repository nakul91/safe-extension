interface IOptions {
  content: string;
  container: HTMLElement;
  timeout: number;
  onHide?: () => void;
  className?: string;
}
class Alert {
  options: IOptions;
  el: HTMLDivElement | null;
  events: Record<string, (...args: any) => void>;
  timer?: number | null;
  constructor(options: IOptions) {
    this.options = options;
    this.el = document.createElement("div");
    this.el.className = `alert-msg ${this.options.className ? this.options.className : ""}`;
    this.events = {};
    this.insert();
    if (this.options.timeout) {
      this.startTimer();
    }
    this.registerEvents();
  }

  insert() {
    if (!this.el) {
      return;
    }
    const elImg = document.createElement("img");
    elImg.className = "alert-logo";
    elImg.src = "";
    elImg.innerHTML = this.options.content;
    this.el?.appendChild(elImg);
    const elMain = document.createElement("div");
    elMain.className = "alert-msg-content";
    elMain.innerHTML = this.options.content;
    this.el?.appendChild(elMain);
    this.options.container.appendChild(this.el);
  }

  registerEvents() {
    if (this.options.timeout) {
      this.events.mouseover = () => this.stopTimer();
      this.events.mouseleave = () => this.startTimer();
      this.el?.addEventListener("mouseover", this.events.mouseover, false);
      this.el?.addEventListener("mouseleave", this.events.mouseleave, false);
    }

    this.events.hide = () => this.hide();
  }

  startTimer(timeout = this.options.timeout) {
    this.timer = setTimeout(() => {
      this.hide();
    }, timeout) as unknown as number;
  }

  stopTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  hide() {
    if (!this.el) {
      return;
    }
    this.el.classList.add(".alert-msg-is-hide");
    this.options.container.removeChild(this.el!);
    this.el = null;
    if (this.options.onHide) {
      this.options.onHide();
    }
    this.stopTimer();
  }
}
let container: HTMLDivElement | null = null;
let style: HTMLStyleElement | null = null;

const styles = `
    .alert-msg-container {
      position: fixed;
      z-index: 1010;
      top: 60px;
      right: 16px;
    }
    .alert-msg {
      height: 44px;
      background: #ffffff;
      border:1px solid #CC703C;
      box-sizing: border-box;
      box-shadow: 0px 24px 40px rgb(237 138 82 / 15%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: #40444D;
      padding: 8px 12px;
      gap: 8px;
      opacity: 1;
    }
    .alert-msg + .alert-msg {
      margin-top: 28px;
    }
    .alert-msg-content {
      display: flex;
      align-items: center;
    }
    .alert-msg-is-hide {
      opacity: 0;
      transition: 0.3s;
    }
    .alert-msg-icon {
      width: 20px;
    }
    .alert-logo{
        max-width:24px;
        max-height:24px;
        border-radius:100%;
        object-fit:cover;
    }
    .alert-msg-close {
      flex-shrink: 0;
      margin-left: 16px;
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .alert-msg-default-wallet {
      border-radius: 12px;
      height: 64px;
      padding-left: 16px;
      padding-right: 20px;

      font-size: 12px;
      line-height: 16px;

      color: #13141A;
    }
  `;

function alertMessage(options: Partial<IOptions>) {
  const { content = "", timeout = 0, className = "" } = options || {};

  if (!container) {
    container = document.createElement("div");
    container.classList.add("alert-msg-container");
    style = document.createElement("style");
    style.innerHTML = styles;
    document.body.appendChild(style);
    document.body.appendChild(container);
  }

  return new Alert({
    content,
    timeout,
    container,
    className,
    onHide: () => {
      if (container && !container?.hasChildNodes()) {
        document.body.removeChild(container);
        style && document.body.removeChild(style);
        style = null;
        container = null;
      }
    },
  });
}

export default alertMessage;
