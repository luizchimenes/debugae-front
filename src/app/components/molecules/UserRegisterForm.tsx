"use client";

import { Input } from "@/app/components/atoms/InputComponent";
import { Label } from "@/app/components/atoms/LabelComponent";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/components/atoms/SelectComponent";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/atoms/CardComponent";
import { useState } from "react";
import { Button } from "../atoms";
import { useRouter } from "next/navigation";
import { UserService } from "@/app/services/userService";
import { AuthService } from "@/app/services/authService";

const UserRegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");

  const router = useRouter();

  const handleBack = () => {
    router.push("/www/login");
  };

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    UserService.create({
      firstName,
      lastName,
      userName,
      email,
      password,
      department,
      position,
    });

    alert("Usuário cadastrado com sucesso!");
    AuthService.login(email, password);
    router.push("/www/dashboard");
  };

  return (
    <div>
      <Card className="p-6 dark:bg-gray-800 rounded-lg shadow-md dark:border dark:border-1 dark:border-primary">
        <CardHeader>
          <CardTitle>Primeiro passo</CardTitle>
          <CardDescription>Preencha suas informações pessoais</CardDescription>
        </CardHeader>
        <hr />
        <CardContent>
          <form>
            <div className="flex w-full gap-4">
              <div className="flex flex-col space-y-1.5 w-full">
                <Label htmlFor="firstName">Primeiro nome</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5 w-full">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex w-full gap-4">
              <div className="flex flex-col space-y-1.5 w-full">
                <Label htmlFor="userName">Nome de Usuário</Label>
                <Input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5 w-full">
                <Label htmlFor="firstName">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex w-full gap-4">
              <div className="flex flex-col space-y-1.5 w-full">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5 w-full">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="p-6 mt-4 dark:bg-gray-800 rounded-lg shadow-md dark:border dark:border-1 dark:border-primary">
        <CardHeader>
          <CardTitle>Segundo passo</CardTitle>
          <CardDescription>
            Preencha suas informações profissionais
          </CardDescription>
        </CardHeader>
        <hr />
        <CardContent>
          <div className="flex w-full gap-4">
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="department">Departamento</Label>
              <Select value={department} onValueChange={setDepartment} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione seu departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Departamentos</SelectLabel>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="position">Função</Label>
              <Select value={position} onValueChange={setPosition} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione seu cargo" /> 
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Funções</SelectLabel>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Quality Analyst">Quality Analyst</SelectItem>
                    <SelectItem value="Product Owner">Product Owner</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack}>
          Voltar
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Cadastrar
        </Button>
      </div>
    </div>
  );
};

export default UserRegisterForm;
