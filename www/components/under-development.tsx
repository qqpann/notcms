import * as React from "react";

interface UnderDevelopmentProps {
  children: React.ReactNode;
}

export function UnderDevelopment({ children }: UnderDevelopmentProps) {
  // 開発環境でのみ表示
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isDevelopment) {
    return null;
  }

  return <>{children}</>;
}
