"use client";

import { Input } from "@atoms/input";
import { Label } from "@atoms/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@atoms/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@atoms/card";
import { useState } from "react";
import UserRegisterFormButtons from "./UserRegisterFormButtons";

const UserRegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione seu departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="position">Cargo</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione seu cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cargos</SelectLabel>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="qa">Quality Analyst</SelectItem>
                    <SelectItem value="qa">Product Owner</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    <UserRegisterFormButtons />
    </div>
  );
};

export default UserRegisterForm;
