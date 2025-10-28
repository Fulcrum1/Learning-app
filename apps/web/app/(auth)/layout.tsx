import React, { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
