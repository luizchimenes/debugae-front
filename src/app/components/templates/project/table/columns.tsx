"use client";

import { Checkbox } from "@/app/components/atoms/CheckboxComponent";
import { UserProject } from "@/app/models/UserProject";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<UserProject>[] = [
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
    accessorKey: "projectName",
    header: "Nome",
    cell: ({ row }) => <div className="capitalize">{row.getValue("projectName")}</div>,
  },
  {
    accessorKey: "projectDescription",
    header: "Descrição",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("projectDescription")}</div>
    ),
  },
  {
    accessorKey: "membersCount",
    header: "Membros",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("membersCount")}</div>
    ),
  },
  {
    accessorKey: "userProjectRole",
    header: "Situação",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("userProjectRole") == "Administrator" ? "Administrador" : "Contribuidor"}</div>
    ),
  },
];
