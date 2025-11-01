interface TamaraWidgetInit {
  lang?: string;
  currency?: string;
}

interface TamaraWidgetInterface {
  init(config: TamaraWidgetInit): void;
  render(): void;
}

declare global {
  interface Window {
    TamaraWidget?: TamaraWidgetInterface;
    tamaraAsyncCallback?: () => void;
    ASSETS?: Record<string, boolean>;
    tamaraWidgetConfig?: {
      lang: string;
      country: string;
      publicKey: string;
    };
  }

  namespace JSX {
    interface IntrinsicElements {
      "tamara-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          type?: string;
          amount?: string;
          "inline-type"?: string;
          "inline-variant"?: string;
          config?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
