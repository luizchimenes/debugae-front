import { Card, CardHeader, CardTitle } from "../atoms";
import { CardDescription } from "../atoms/CardComponent";
import UserRegisterForm from "../molecules/UserRegisterForm";
import { ThemeToggle } from "../molecules/ThemeToggle";

const UserRegisterTemplate = () => {
  return (
    <div className="min-h-screen bg-primary dark:bg-gray-900 flex items-center justify-center relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-[1300px] p-8 dark:bg-gray-800 rounded-lg shadow-md border border-1 border-primary">
        <CardHeader>
          <CardTitle>Cadastrar novo usuário</CardTitle>
          <CardDescription>
            Preencha o formulário com suas informações
          </CardDescription>
        </CardHeader>
        <UserRegisterForm />
      </Card> 
    </div>
  );
};

export default UserRegisterTemplate;
