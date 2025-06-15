"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/atoms/CardComponent";
import { AuthService } from "@/app/services/authService";
import { Project, ProjectService } from "@/app/services/projectService";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../atoms/TableComponent";

const DashboardProjectView = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const loggedUser = AuthService.getLoggedUser();

  const EmptyRow = ({ colSpan }: { colSpan: number }) => (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="text-center py-4 text-muted-foreground"
      >
        Nenhum item encontrado.
      </TableCell>
    </TableRow>
  );

  useEffect(() => {
    const data = ProjectService.getAllProjectsByUser(loggedUser.id);
    if (data.length > 0) {
      setProjects(data);
    } else {
      setProjects([]);
    }
  }, []);
  return (
    <Card className="w-full mx-auto p-4 m-4 dark:bg-gray-800 rounded-lg shadow-md border border-primary">
      <CardHeader>
        <CardTitle>Meus projetos atuais</CardTitle>
        <CardDescription>
          Listagem básica dos seus projetos atuais. Caso deseje mais
          informações, entre na aba de projetos
        </CardDescription>
      </CardHeader>
      <hr />
      <Table className="rounded-xl border overflow-hidden shadow-sm">
        <TableHeader className="bg-gradient-main">
          <TableRow>
            <TableHead className="text-white">Nome</TableHead>
            <TableHead className="text-white">Descrição</TableHead>
            <TableHead className="text-white">Situação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell className="font-small">
                  {project.description}
                </TableCell>
                <TableCell className="font-small">
                  {project.adminId === loggedUser.id
                    ? "Administrador"
                    : "Membro"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <EmptyRow colSpan={3} />
          )}
        </TableBody>
      </Table>
      <CardContent></CardContent>
    </Card>
  );
};

export default DashboardProjectView;
