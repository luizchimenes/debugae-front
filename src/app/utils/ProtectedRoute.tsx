"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "../components/atoms/ProgressComponent";
import { useAtom } from "jotai";
import { userAtom } from "../stores/atoms/userAtom";
import { AuthService } from "../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentLoggedUser, setCurrentLoggedUser] = useAtom(userAtom);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 200);

    const checkAuth = async () => {
      try {
        let user = currentLoggedUser;
        if (!user) {
          user = await AuthService.getLoggedUser();
          if (user) {
            setCurrentLoggedUser(user);
          }
        }

        if (!user) {
          router.replace("/www/login");
          return;
        }

        setProgress(100);
        setTimeout(() => setIsCheckingAuth(false), 500);

      } catch (error) {
        console.error("Erro de autenticação:", error);
        router.replace("/www/login");
      }
    };

    checkAuth();
    return () => clearInterval(progressInterval);
  }, [currentLoggedUser, router, setCurrentLoggedUser]);

  if (isCheckingAuth) {
    return (
      <div className="fixed top-0 left-0 w-full z-50">
        <Progress
          value={progress}
          className="h-1 w-full transition-all duration-300"
        />
      </div>
    );
  }

  return <>{children}</>;
}