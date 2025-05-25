import { Card, CardHeader, CardTitle } from "../atoms";
import { CardDescription } from "../atoms/CardComponent";
import UserRegisterForm from "../molecules/UserRegisterForm";
import { ThemeToggle } from "../molecules/ThemeToggle";

const UserRegisterTemplate = () => {
  return (
    <div className="min-h-screen bg-gradient-main dark:bg-gradient-main flex items-center justify-center relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-[1350px] mx-auto p-8 dark:bg-gray-800 rounded-lg shadow-md border border-primary">
        <CardHeader>
          <CardTitle>Cadastrar novo usuário</CardTitle>
          <CardDescription>
            Preencha o formulário com suas informações
          </CardDescription>
        </CardHeader>
        <UserRegisterForm />
      </Card>
      <ThemeToggle />
    </div>
  );
};

export default UserRegisterTemplate;
