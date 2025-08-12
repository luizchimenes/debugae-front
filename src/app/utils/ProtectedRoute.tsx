"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "../components/atoms/ProgressComponent";
import { useAtom, useAtomValue } from "jotai";
import { userAtom } from "../stores/atoms/userAtom";
import Cookies from "js-cookie";
import { AuthService } from "../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentLoggedUser, setCurrentLoggedUser] = useAtom(userAtom)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + 10;
        clearInterval(interval);
        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cookie = Cookies.get("auth_cookie");
    
    if (!cookie) {
      router.replace("/www/login");
    } else {
      const checkUserData = async () => {
        if (currentLoggedUser == null) {
          const userData = await AuthService.getLoggedUser();
          setCurrentLoggedUser(userData);
        }
      }

      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsCheckingAuth(false);
        }, 200);
      }, 300);

      checkUserData();
    }
  }, []);

  return (
    <>
      {isCheckingAuth && (
        <div className="fixed top-0 left-0 w-full z-50">
          <Progress
            value={progress}
            className="h-1 w-full transition-all duration-300"
          />
        </div>
      )}
      {children}
    </>
  );
}
