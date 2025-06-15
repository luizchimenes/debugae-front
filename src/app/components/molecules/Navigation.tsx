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
import { LoadingOverlay } from "../atoms/LoadingPage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
      "Visualize todos os defeitos em que você são o principal responsável",
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
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingTitle, setLoadingTitle] = React.useState("");
  const [loadingSubtitle, setLoadingSubtitle] = React.useState("");
  const router = useRouter();

  const handleRedirect = async (
    path: string,
    title?: string,
    subtitle?: string
  ) => {
    try {
      setIsLoading(true);
      setLoadingTitle(title || "Navegando");
      setLoadingSubtitle(
        subtitle || "Redirecionando para a página solicitada..."
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      router.push(path);
    } catch (err) {
      console.error("Erro ao redirecionar:", err);
      toast.error("Erro ao redirecionar", {
        description: "Ocorreu um problema ao navegar. Tente novamente.",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <LoadingOverlay
          title={loadingTitle}
          subtitle={loadingSubtitle}
          showDots={true}
        />
      )}

      <div className="flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <button
                onClick={() =>
                  handleRedirect(
                    "/www/dashboard",
                    "Acessando Dashboard",
                    "Carregando painel principal..."
                  )
                }
                className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                disabled={isLoading}
              >
                <Home className="h-4 w-4 mr-3" />
                Menu Inicial
              </button>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger disabled={isLoading}>
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
                      onClick={() =>
                        handleRedirect(
                          href,
                          title.includes("Novo")
                            ? "Novo projeto"
                            : "Carregando Projetos",
                          title.includes("Novo")
                            ? "Preparando formulário..."
                            : "Buscando seus projetos..."
                        )
                      }
                      title={title}
                      icon={<Icon className="w-4 h-4 text-muted-foreground" />}
                      disabled={isLoading}
                    >
                      {description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger disabled={isLoading}>
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
                      onClick={() =>
                        handleRedirect(
                          href,
                          title.includes("Cadastrar")
                            ? "Novo defeito"
                            : "Carregando Defeitos",
                          title.includes("Cadastrar")
                            ? "Preparando formulário..."
                            : "Buscando seus defeitos..."
                        )
                      }
                      icon={<Icon className="w-4 h-4 text-muted-foreground" />}
                      disabled={isLoading}
                    >
                      {description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger disabled={isLoading}>
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Relatórios
                </span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <ListItem
                    onClick={() =>
                      handleRedirect(
                        "/www/reports/bug-report",
                        "Gerando Relatório",
                        "Processando dados dos defeitos..."
                      )
                    }
                    title="Relatório de Defeitos"
                    icon={
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    }
                    disabled={isLoading}
                  >
                    Gere um relatório completo com os defeitos cadastrados
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <button
                onClick={() =>
                  handleRedirect(
                    "/www/about",
                    "Quer descobrir mais sobre o sistema",
                    "Carregando nossos dados..."
                  )
                }
                className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                disabled={isLoading}
              >
                <Info className="h-4 w-4 mr-3" />
                Sobre
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
}

const ListItem = React.memo(
  React.forwardRef<
    React.ElementRef<"button">,
    React.ComponentPropsWithoutRef<"button"> & {
      icon?: React.ReactNode;
      title: string;
      children: React.ReactNode;
      disabled?: boolean;
    }
  >(({ className, title, children, icon, disabled, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <button
            ref={ref}
            className={cn(
              "flex gap-3 items-start select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            disabled={disabled}
            {...props}
          >
            {icon && <div className="mt-1 flex-shrink-0">{icon}</div>}
            <div className="flex-1">
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                {children}
              </p>
            </div>
          </button>
        </NavigationMenuLink>
      </li>
    );
  })
);
ListItem.displayName = "ListItem";
