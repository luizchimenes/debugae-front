"use client";

import { Input } from "@/app/components/atoms/InputComponent";
import { Label } from "@/app/components/atoms/LabelComponent";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/atoms/CardComponent";
import { useState } from "react";
import { Textarea } from "../atoms/TextAreaComponent";
import { ScrollArea } from "../atoms/ScrollAreaComponent";

const ProjectCreateForm = () => {
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
              <Input id="projectName" type="text" required />
            </div>
          </div>
          <hr className="my-4" />
          <div className="grid w-full gap-4">
            <Label htmlFor="projectDescription">Descrição do Projeto</Label>
            <Textarea id="projectDescription" />
          </div>
          <hr className="my-4" />
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
              <Label htmlFor="projectName">Selecione o Contrbuinte</Label>
              <Input id="projectName" type="text" required />
            </div>
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="projectName">Contribuintes do Projeto</Label>
              <ScrollArea className="whitespace-nowrap rounded-md border">

              </ScrollArea>
            </div>
          </div>
          <hr className="my-4" />
        </form>
      </Card>
    </div>
  );
};

export default ProjectCreateForm;
