import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

/**
 * ErrorBoundary Component
 *
 * React 앱에서 발생하는 예상치 못한 런타임 오류를 잡아서
 * 사용자에게 친절한 안내 화면을 보여줍니다.
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: unknown): ErrorBoundaryState {
    // 다음 렌더링에서 폴백 UI를 보여주도록 상태 업데이트
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // TODO: 나중에 Sentry/로그 수집 서비스 연동 가능
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReload = () => {
    // 페이지 새로고침으로 복구 시도
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // 에러 발생 시 폴백 UI 렌더링
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              문제가 발생했습니다
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              잠시 후 다시 시도해 주세요. 문제가 지속되면 점주에게 문의해 주세요.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
