"use client";

import { Button, CardHeader, Input, Label } from "../atoms";
import { Card, CardDescription, CardTitle } from "../atoms/CardComponent";
import { ScrollArea } from "../atoms/ScrollAreaComponent";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../atoms/SelectComponent";
import { Textarea } from "../atoms/TextAreaComponent";

const BugCreateForm = () => {
  return (
    <div>
      <Card className="p-6 dark:bg-gray-800 rounded-lg shadow-md dark:border dark:border-1 border-primary">
        <CardHeader>
          <CardTitle>Primeiro passo</CardTitle>
          <CardDescription>
            Selecione o projeto em que o defeito ocorre
          </CardDescription>
        </CardHeader>
        <hr />
        <form>
          <div className="flex w-full gap-4">
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="projectName">Projeto</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Projetos</SelectLabel>
                    <SelectItem value="first">Projeto 1</SelectItem>
                    <SelectItem value="second">Projeto 2</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </Card>
      <Card className="p-6 mt-4 dark:bg-gray-800 rounded-lg shadow-md dark:border dark:border-1 border-primary">
        <CardHeader>
          <CardTitle>Segundo passo</CardTitle>
          <CardDescription>Adicione as informações do defeito</CardDescription>
        </CardHeader>
        <hr />
        <form>
          <div className="grid w-full gap-4">
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="bugSummary">Sumário do defeito</Label>
              <Input id="bugSummary" type="text" required />
            </div>
            <div className="grid w-full gap-4">
              <Label htmlFor="bugDescription">Descrição do Defeito</Label>
              <Textarea id="bugDescription" />
            </div>
          </div>
          <div className="mt-4 flex w-full gap-4">
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="bugEnvironment">Ambiente</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o ambiente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Ambientes</SelectLabel>
                    <SelectItem value="prod">Produção</SelectItem>
                    <SelectItem value="homol">Homologação</SelectItem>
                    <SelectItem value="dev">Desenvolvimento</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="bugSeverity">Severidade</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Ambientes</SelectLabel>
                    <SelectItem value="1">Muito Alta</SelectItem>
                    <SelectItem value="2">Alta</SelectItem>
                    <SelectItem value="3">Média</SelectItem>
                    <SelectItem value="4">Baixa</SelectItem>
                    <SelectItem value="5">Muito Baixa</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="bugVersion">Versão do sistema</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a versão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Versões</SelectLabel>
                    <SelectItem value="1.2.0">1.2.0</SelectItem>
                    <SelectItem value="1.1.2">1.1.2</SelectItem>
                    <SelectItem value="1.1.1">1.1.1</SelectItem>
                    <SelectItem value="1.1.0">1.1.0</SelectItem>
                    <SelectItem value="1.0.0">1.0.0</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="bugCategory">Categoria</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categoria</SelectLabel>
                    <SelectItem value="functional">Funcional</SelectItem>
                    <SelectItem value="interface">Interface</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="feature">Melhoria</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </Card>
      <Card className="p-6 mt-4 dark:bg-gray-800 rounded-lg shadow-md dark:border dark:border-1 border-primary">
        <CardHeader>
          <CardTitle>Terceiro passo</CardTitle>
          <CardDescription>
            Informações adicionais sobre o defeito
          </CardDescription>
        </CardHeader>
        <hr />
        <form>
          <div className="grid w-full gap-4">
            <Label htmlFor="bugCurrentBehavior">
              Comportamento atual do sistema
            </Label>
            <Textarea id="bugCurrentBehavior" />
          </div>
          <div className="mt-4 grid w-full gap-4">
            <Label htmlFor="bugExpectedBehavior">
              Comportamento esperado do sistema
            </Label>
            <Textarea id="bugExpectedBehavior" />
          </div>
          <div className="mt-4 grid w-full gap-4">
            <Label htmlFor="bugStackTrace">Log de erro</Label>
            <Textarea id="bugStackTrace" />
          </div>
          <div className="mt-4 grid w-full gap-4">
            <Label htmlFor="bugFile">Anexo</Label>
            <Input id="bugFile" type="file" required />
          </div>
        </form>
      </Card>
      <div className="flex justify-between mt-6">
        <Button variant="outline">
          Voltar
        </Button>
        <Button type="button">
          Cadastrar
        </Button>
      </div>
    </div>
  );
};

export default BugCreateForm;
