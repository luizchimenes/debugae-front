"use client";

import { useEffect, useState } from "react";
import { Button, CardHeader, Input, Label } from "../atoms";
import { Card, CardDescription, CardTitle } from "../atoms/CardComponent";
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
import { saveBug } from "@/app/services/bugService";
import { User } from "@/app/services/userService";
import { AuthService } from "@/app/services/authService";
import { Project, ProjectService } from "@/app/services/projectService";
import { toast } from "sonner";

const BugCreateForm = () => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [environment, setEnvironment] = useState("");
  const [severity, setSeverity] = useState("");
  const [version, setVersion] = useState("");
  const [category, setCategory] = useState("");
  const [currentBehavior, setCurrentBehavior] = useState("");
  const [expectedBehavior, setExpectedBehavior] = useState("");
  const [stackTrace, setStackTrace] = useState("");
  const [attachment, setAttachment] = useState<string | undefined>(undefined);
  const [projectId, setProjectId] = useState("");

  const loggedUser: User = AuthService.getLoggedUser();

  useEffect(() => {
    setAllProjects(ProjectService.getAllProjects());
  }, []);

  const handleSubmit = () => {
    saveBug({
      projectId,
      summary,
      description,
      environment,
      severity,
      version,
      category,
      currentBehavior,
      expectedBehavior,
      stackTrace,
      attachment,
      createdBy: loggedUser.id,
    });

    toast.success("Defeito criado com sucesso!", {
      description: "Seu defeito foi cadastrado em nosso sistema",
      action: {
        label: "Ver",
        onClick: () => console.log("teste"),
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form>
      <Card className="p-6 dark:bg-gray-800 rounded-lg shadow-md dark:border border-primary">
        <CardHeader>
          <CardTitle>Primeiro passo</CardTitle>
          <CardDescription>
            Selecione o projeto em que o defeito ocorre
          </CardDescription>
        </CardHeader>
        <hr />
        <div className="flex w-full gap-4">
          <div className="flex flex-col space-y-1.5 w-full">
            <Label htmlFor="projectId">Projeto</Label>
            <Select onValueChange={setProjectId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Projetos</SelectLabel>
                  {allProjects.map((project: any) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6 mt-4 dark:bg-gray-800 rounded-lg shadow-md dark:border border-primary">
        <CardHeader>
          <CardTitle>Segundo passo</CardTitle>
          <CardDescription>Adicione as informações do defeito</CardDescription>
        </CardHeader>
        <hr />
        <div className="grid w-full gap-4">
          <div className="flex flex-col space-y-1.5 w-full">
            <Label htmlFor="bugSummary">Sumário do defeito</Label>
            <Input
              id="bugSummary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col space-y-1.5 w-full">
            <Label htmlFor="bugDescription">Descrição do Defeito</Label>
            <Textarea
              id="bugDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex w-full flex-wrap gap-4">
          <div className="flex flex-col space-y-2 w-full md:w-[48%]">
            <Label htmlFor="bugEnvironment">Ambiente</Label>
            <Select onValueChange={setEnvironment}>
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

          <div className="flex flex-col space-y-2 w-full md:w-[48%]">
            <Label htmlFor="bugSeverity">Severidade</Label>
            <Select onValueChange={setSeverity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a severidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Severidade</SelectLabel>
                  <SelectItem value="1">Muito Alta</SelectItem>
                  <SelectItem value="2">Alta</SelectItem>
                  <SelectItem value="3">Média</SelectItem>
                  <SelectItem value="4">Baixa</SelectItem>
                  <SelectItem value="5">Muito Baixa</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-2 w-full md:w-[48%]">
            <Label htmlFor="bugVersion">Versão</Label>
            <Select onValueChange={setVersion}>
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

          <div className="flex flex-col space-y-2 w-full md:w-[48%]">
            <Label htmlFor="bugCategory">Categoria</Label>
            <Select onValueChange={setCategory}>
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
      </Card>

      <Card className="p-6 mt-4 dark:bg-gray-800 rounded-lg shadow-md dark:border border-primary">
        <CardHeader>
          <CardTitle>Terceiro passo</CardTitle>
          <CardDescription>
            Informações adicionais sobre o defeito
          </CardDescription>
        </CardHeader>
        <hr />
        <div className="grid w-full gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="bugCurrentBehavior">Comportamento atual</Label>
            <Textarea
              id="bugCurrentBehavior"
              value={currentBehavior}
              onChange={(e) => setCurrentBehavior(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="bugExpectedBehavior">Comportamento esperado</Label>
            <Textarea
              id="bugExpectedBehavior"
              value={expectedBehavior}
              onChange={(e) => setExpectedBehavior(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="bugStackTrace">Log de erro</Label>
            <Textarea
              id="bugStackTrace"
              value={stackTrace}
              onChange={(e) => setStackTrace(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="bugFile">Anexo</Label>
            <Input id="bugFile" type="file" onChange={handleFileChange} />
          </div>
        </div>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline">Voltar</Button>
        <Button type="submit" onClick={handleSubmit}>
          Cadastrar
        </Button>
      </div>
    </form>
  );
};

export default BugCreateForm;
