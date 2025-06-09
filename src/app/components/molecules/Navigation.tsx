"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../atoms/NavigationMenuComponent";

import {
  Home,
  Bug,
  FileText,
  PlusCircle,
  FolderKanban,
  Info,
} from "lucide-react";

const defects = [
  {
    title: "Cadastrar novo defeito",
    href: "/www/bugs/create",
    description: "Cadastre um novo defeito em um projeto específico",
    icon: PlusCircle,
  },
  {
    title: "Meus defeitos",
    href: "/www/bugs/list",
    description:
      "Visualize todos os defeitos em que você é o principal responsável",
    icon: Bug,
  },
];

const projects = [
  {
    title: "Novo projeto",
    href: "/www/project/create",
    description: "Crie um novo projeto",
    icon: PlusCircle,
  },
  {
    title: "Meus projetos",
    href: "/www/project/list",
    description: "Visualize e gerencie os projetos em que você participa",
    icon: FolderKanban,
  },
];

export function Navigation() {
  return (
    <div className="flex items-center justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              href="/www/dashboard"
              className={navigationMenuTriggerStyle()}
              prefetch
            >
              <Home className="h-4 w-4 mr-3" />
              Menu Inicial
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <span className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                Projetos
              </span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                {projects.map(({ title, href, description, icon: Icon }) => (
                  <ListItem
                    key={title}
                    href={href}
                    title={title}
                    icon={<Icon className="w-4 h-4 text-muted-foreground" />}
                  >
                    {description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <span className="flex items-center gap-2">
                <Bug className="w-4 h-4" />
                Defeitos
              </span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {defects.map(({ title, href, description, icon: Icon }) => (
                  <ListItem
                    key={title}
                    title={title}
                    href={href}
                    icon={<Icon className="w-4 h-4 text-muted-foreground" />}
                  >
                    {description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Relatórios
              </span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <ListItem
                  href="/www/reports/bug-report"
                  title="Relatório de Defeitos"
                  icon={
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  }
                >
                  Gere um relatório completo com os defeitos cadastrados
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link
              href="/www/about"
              className={navigationMenuTriggerStyle()}
              prefetch
            >
              <Info className="h-4 w-4 mr-3" />
              Sobre
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

// Memoize para evitar re-renderizações desnecessárias
const ListItem = React.memo(
  React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
  >(({ className, title, children, icon, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "flex gap-3 items-start select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            {icon && <div className="mt-1">{icon}</div>}
            <div>
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </div>
          </a>
        </NavigationMenuLink>
      </li>
    );
  })
);
ListItem.displayName = "ListItem";
