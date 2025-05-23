import LoginForm from "@molecules/LoginForm";
import { Card } from "../atoms";
import { ThemeToggle } from "../molecules/ThemeToggle";

const LoginTemplate = () => {
  return (
    <div className="min-h-screen bg-primary dark:bg-gray-900 flex items-center justify-center relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md p-8 dark:bg-gray-800 rounded-lg shadow-md border border-2 border-primary">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          DebugAE
        </h1>
        <LoginForm />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Não possui um cadastro?{" "}
          <a href="/www/user/create" className="text-primary hover:text-blue-700">
            Clique aqui para efetuar o cadastro
          </a>
        </span>
      </Card>
    </div>
  );
};

export default LoginTemplate;
