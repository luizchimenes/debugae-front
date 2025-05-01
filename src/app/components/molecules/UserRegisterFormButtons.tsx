"use client";

import { useRouter } from "next/navigation";
import { Button } from "@atoms/button";

const UserRegisterFormButtons = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push("/login");
  };

  const handleSubmit = () => {
    router.push("/dashboard");
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
