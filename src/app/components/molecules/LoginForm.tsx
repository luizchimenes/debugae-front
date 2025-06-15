"use client";

import { Button } from "@/app/components/atoms/ButtonComponent";
import { Input } from "@/app/components/atoms/InputComponent";
import { Label } from "@/app/components/atoms/LabelComponent";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/app/components/atoms/CardComponent";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/app/services/authService";
import { toast } from "sonner";
import { LoadingOverlay } from "../atoms/LoadingPage";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const user = AuthService.login(email, password);

      if (user) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        router.push("/www/dashboard");
      } else {
        toast.error("Credenciais inválidas", {
          description:
            "Credenciais inseridas estão incorretas! Verifique e tente novamente",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro interno", {
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <LoadingOverlay
          title="Validando credenciais"
          subtitle="Aguarde enquanto validamos seus dados"
        />
      )}

      <Card className="w-full max-w-sm border border-1 border-primary dark:border-none mb-4">
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}
              <hr />
              <CardFooter className="flex justify-between">
                <Button type="submit">Entrar</Button>
                <a href="/reset-password">Esqueci minha senha</a>
              </CardFooter>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default LoginForm;
