"use client";

import { Button } from "@/app/components/atoms";
import { Checkbox } from "@/app/components/atoms/CheckboxComponent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/atoms/DropdownMenuComponent";
import User from "@/app/models/User";
import { AuthService } from "@/app/services/authService";
import { UserService } from "@/app/services/userService";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export type Project = {
  id: string;
  name: string;
  description: string;
  contributors: string[];
  adminId: string;
};

export const columns: ColumnDef<Project>[] = [
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
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "contributors",
    header: "Membros",
    cell: ({ row }) => {
      const contributorIds = row.getValue("contributors") as string[];
      const [contributors, setContributors] = useState<User[]>([]);

      useEffect(() => {
        if (contributorIds && contributorIds.length > 0) {
          const contributors = UserService.getByListIds(contributorIds);
          setContributors(contributors);
        }
      }, [contributorIds]);

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 p-0 rounded-full text-xs border-primary"
                title="Ver Contribuidores"
              >
                {contributors.length}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {contributors.map((user) => (
                <DropdownMenuItem key={user.id}>
                  {user.firstName} {user.lastName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
  {
    accessorKey: "adminId",
    header: "Situação",
    cell: ({ row }) => {
      const [loggedUser, setLoggedUser] = useState<User | null>(null);

      useEffect(() => {
        AuthService.getLoggedUser().then(setLoggedUser);
      }, []);

      return (
        <div>
          {loggedUser && row.getValue("adminId") === loggedUser.id ? "Administrador" : "Membro"}
        </div>
      );
    },
  }
];
