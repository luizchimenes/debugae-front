"use client";

import { useEffect, useState } from "react";
import { Input } from "@/app/components/atoms/InputComponent";
import { Label } from "@/app/components/atoms/LabelComponent";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/atoms/CardComponent";
import { Textarea } from "../atoms/TextAreaComponent";
import { ScrollArea } from "../atoms/ScrollAreaComponent";
import { User, UserService } from "@/app/services/userService";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../atoms/SelectComponent";
import { Button } from "../atoms";
import { AuthService } from "@/app/services/authService";
import { ProjectService } from "@/app/services/projectService";
import { toast } from "sonner";

const ProjectCreateForm = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedContributor, setSelectedContributor] = useState<
    string | undefined
  >(undefined);
  const [contributors, setContributors] = useState<string[]>([]);

  const loggedUser: User = AuthService.getLoggedUser();

  useEffect(() => {
    setAllUsers(UserService.getAll());
  }, []);

  const handleAddContributor = () => {
    if (selectedContributor && !contributors.includes(selectedContributor)) {
      setContributors([...contributors, selectedContributor]);
    }
  };

  const handleRemoveContributor = (id: string) => {
    setContributors(contributors.filter((c) => c !== id));
  };

  const handleSave = () => {
    ProjectService.saveProject({
      name: projectName,
      description: projectDescription,
      contributors,
      adminId: loggedUser.id,
    });
    setProjectName("");
    setProjectDescription("");
    setContributors([]);
    setSelectedContributor(undefined);
    toast("Projeto criado com sucesso!", {
      description: "Seu projeto foi cadastrado em nosso sistema",
      action: {
        label: "Ver",
        onClick: () => console.log("teste"),
      },
    });

    setTimeout(() => {
      window.location.href = "/www/project/list";
    }, 2000);
  };

  return (
    <div>
      <Card className="p-6 dark:bg-gray-800 rounded-lg shadow-md dark:border dark:border-1 border-primary">
        <CardHeader>
          <CardTitle>Primeiro passo</CardTitle>
          <CardDescription>Preencha as informações do projeto</CardDescription>
        </CardHeader>
        <hr />
        <form>
          <div className="flex w-full gap-4">
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="projectName">Nome do Projeto</Label>
              <Input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>
          </div>
          <hr className="my-4" />
          <div className="grid w-full gap-4">
            <Label htmlFor="projectDescription">Descrição do Projeto</Label>
            <Textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
        </form>
      </Card>
      <Card className="p-6 mt-4 dark:bg-gray-800 rounded-lg shadow-md dark:border dark:border-1 border-primary">
        <CardHeader>
          <CardTitle>Segundo passo</CardTitle>
          <CardDescription>
            Adicione os contribuintes do projeto
          </CardDescription>
        </CardHeader>
        <hr />
        <form>
          <div className="flex w-full gap-4">
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="contributors">Selecione o Contribuinte</Label>
              <Select
                onValueChange={setSelectedContributor}
                value={selectedContributor}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Contribuintes</SelectLabel>
                    {allUsers.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={handleAddContributor}
                className="mt-2"
              >
                Adicionar
              </Button>
            </div>

            <div className="flex flex-col space-y-1.5 w-full">
              <Label>Contribuintes do Projeto</Label>
              <ScrollArea className="h-[120px] p-2 border rounded-md">
                {contributors.map((id) => {
                  const user: any = allUsers.find((u: any) => u.id === id);
                  return (
                    <div
                      key={id}
                      className="flex justify-between items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded mb-1"
                    >
                      <span>
                        {user?.firstName} {user?.lastName}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => handleRemoveContributor(id)}
                      >
                        Remover
                      </Button>
                    </div>
                  );
                })}
              </ScrollArea>
            </div>
          </div>
        </form>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline">Voltar</Button>
        <Button type="button" onClick={handleSave}>
          Cadastrar
        </Button>
      </div>
    </div>
  );
};

export default ProjectCreateForm;
