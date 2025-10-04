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
import { Project } from "@/app/models/Project";
import { UserBug } from "@/app/models/UserBug";
import { ProjectService } from "@/app/services/projectService";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const tagsFilter: FilterFn<UserBug> = (row, columnId, filterValue) => {
  const tags = row.getValue(columnId);
  if (!filterValue) return true;
  if (Array.isArray(tags)) {
    return tags.some((tag) =>
      tag.toLowerCase().includes(filterValue.toLowerCase())
    );
  }
  if (typeof tags === "string") {
    return tags.toLowerCase().includes(filterValue.toLowerCase());
  }
  return false;
};

export const columns: ColumnDef<UserBug>[] = [
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
    accessorFn: (row) => row.project?.projectName, 
    id: "projectName", 
    header: "Projeto",
    cell: ({ row }) => {  
      return <div className="capitalize">{row.original.project?.projectName}</div>;
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
    accessorKey: "defectPriority",
    header: "Prioridade",
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("defectPriority")}</div>;
    },
  },
  {
    accessorKey: "expirationDate",
    header: "Validade",
    cell: ({ row }) => {
      const value = row.getValue("expirationDate") as string;
      const formatted = value
        ? new Date(value).toLocaleDateString("pt-BR")
        : "";
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    filterFn: tagsFilter,
    cell: ({ row }) => {
      const value = row.getValue("tags");
      const formatted = value
        ? (Array.isArray(value) ? value : [value]).join(", ")
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
