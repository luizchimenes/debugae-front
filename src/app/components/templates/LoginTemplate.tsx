import LoginForm from "@molecules/LoginForm";
import { Card } from "../atoms";
import { ThemeToggle } from "../molecules/ThemeToggle";
import { Poppins } from "next/font/google";
import LogoIconLogin from "../molecules/LogoIconLogin";

const LoginTemplate = () => {
  return (
    <div className="min-h-screen bg-gradient-main dark:bg-gradient-main flex items-center justify-center relative">
      <Card className="w-full max-w-md p-8 dark:bg-gray-800 rounded-lg shadow-md border border-2 border-primary">
        <LogoIconLogin />
        <LoginForm />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Não possui um cadastro?{" "}
          <a
            href="/www/user/create"
            className="text-primary hover:text-blue-700"
          >
            Clique aqui para efetuar o cadastro
          </a>
        </span>
      </Card>
      <ThemeToggle />
    </div>
  );
};

export default LoginTemplate;
