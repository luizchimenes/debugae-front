"use client";

import { Button } from "@/app/components/atoms";
import { Checkbox } from "@/app/components/atoms/CheckboxComponent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/components/atoms/DropdownMenuComponent";
import { Project, ProjectService } from "@/app/services/projectService";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

export type Bug = {
  id: string;
  projectId: string;
  summary: string;
  description: string;
  environment: string;
  severity: string;
  version: string;
  category: string;
  currentBehavior: string;
  expectedBehavior: string;
  stackTrace: string;
  attachment?: string; // base64 ou URL
  createdBy: string; // id do usuário/admin
};

export const columns: ColumnDef<Bug>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar tudo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecione"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "summary",
    header: "Resumo",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("summary")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "projectId",
    header: "Projeto",
    cell: ({ row }) => {
      const projectId = row.getValue("projectId") as string;
      const [project, setProject] = useState<Project>();

      useEffect(() => {
        if (projectId) {
          const project = ProjectService.getById(projectId);
          setProject(project);
        }
      }, []);

      return <div className="capitalize">{project?.name}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("status")}</div>;
    },
  },
  {
    accessorKey: "severity",
    header: "Prioridade",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("severity")}</div>;
    },
  },
  {
    accessorKey: "expiredDate",
    header: "Validade",
    cell: ({ row }) => {
      const value = row.getValue("expiredDate") as string;
      const formatted = value
        ? new Date(value).toLocaleDateString("pt-BR")
        : "";
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem>Visualizar defeito</DropdownMenuItem>
            <DropdownMenuItem>Alterar Status do defeito</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
