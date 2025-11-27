export { };

declare global {
  interface Window {
    AUTHNICE?: {
      requestPay: (options: any) => void;
    };
  }
}
