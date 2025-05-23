"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/app/components/atoms/ButtonComponent";

const UserRegisterFormButtons = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push("/www/login");
  };

  const handleSubmit = () => {
    router.push("/www/dashboard");
  };

  return (
    <div className="flex justify-between mt-6">
      <Button variant="outline" onClick={handleBack}>
        Voltar
      </Button>
      <Button type="button" onClick={handleSubmit}>
        Cadastrar
      </Button>
    </div>
  );
};

export default UserRegisterFormButtons;
