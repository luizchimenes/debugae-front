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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + 10;
        clearInterval(interval);
        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const user = AuthService.getLoggedUser();

    if (!user) {
      router.replace("/www/login");
    } else {
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsCheckingAuth(false);
        }, 200); 
      }, 300);
    }
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="w-full flex justify-center items-center h-40">
        <Progress value={progress} className="w-[60%] transition-all duration-300" />
      </div>
    );
  }

  return <>{children}</>;
}
