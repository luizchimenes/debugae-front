"use client";

import { Button } from "@atoms/button";
import { Input } from "@atoms/input";
import { Label } from "@atoms/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@atoms/card";
import { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card className="w-full max-w-sm border border-1 border-primary dark:border-none mb-4">
      <CardContent>
        <form>
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
            <hr />
            <CardFooter className="flex justify-between">
              <Button type="submit">Entrar</Button>
              <a
                href="/reset-password" 
              >
                Esqueci minha senha
              </a>
            </CardFooter>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
