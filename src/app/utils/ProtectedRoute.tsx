"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/app/services/authService";
import { Progress } from "../components/atoms/ProgressComponent";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const user = AuthService.getLoggedUser();

    if (!user) {
      router.replace("/www/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="w-full flex justify-center items-center h-40">
        <Progress value={progress} className="w-[60%]" />
      </div>
    );
  }

  return <>{children}</>;
}
