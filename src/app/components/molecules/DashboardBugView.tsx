"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/atoms/CardComponent";
import { AuthService } from "@/app/services/authService";
import { Bug, BugService } from "@/app/services/bugService";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../atoms/TableComponent";

const DashboardBugView = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);

  const loggedUser = AuthService.getLoggedUser();

  useEffect(() => {
    const data = BugService.getAllBugsByUser(loggedUser.id);
    console.log(data);
    if (data.length > 0) {
      setBugs(data);
    } else {
      setBugs([]);
    }
  }, []);

  return (
    <Card className="w-full mx-auto p-4 m-4 dark:bg-gray-800 rounded-lg shadow-md border border-primary">
      <CardHeader>
        <CardTitle>Meus defeitos atuais</CardTitle>
        <CardDescription>
          Listagem básica dos seus defeitos. Caso deseje mais informações, entre
          na aba de defeitos.
        </CardDescription>
      </CardHeader>
      <hr />
      <Table className="rounded-xl border overflow-hidden shadow-sm">
        <TableHeader className="bg-gradient-main">
          <TableRow>
            <TableHead className="text-white">Resumo</TableHead>
            <TableHead className="text-white">Descrição</TableHead>
            <TableHead className="text-white">Expira em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bugs.length > 0 ? (
            bugs.map((bug) => (
              <TableRow key={bug.id}>
                <TableCell className="font-medium">{bug.summary}</TableCell>
                <TableCell className="font-small">{bug.status}</TableCell>
                <TableCell className="font-small">{new Date(bug.expiredDate).toLocaleDateString("pt-BR")}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center py-4 text-muted-foreground"
              >
                Nenhum defeito encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CardContent></CardContent>
    </Card>
  );
};

export default DashboardBugView;
