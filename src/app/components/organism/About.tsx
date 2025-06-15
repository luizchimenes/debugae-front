"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/atoms/CardComponent";
import { Button } from "../atoms";
import {
  Users,
  Target,
  Heart,
  Bug,
  Globe,
  Mail,
  Zap,
  Github,
  Linkedin,
  AlertTriangle,
  BarChart3,
  Settings,
  FileText,
  MessageSquare,
} from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Guilherme Gruner",
      role: "CFO",
      avatar: "GG",
      description:
        "Líder estratégico na otimização de recursos para aprimoramento contínuo da ferramenta de reporte de bugs, garantindo que o sistema seja robusto e eficiente.",
      social: { github: "https://github.com/Birckholz", linkedin: "https://www.linkedin.com/in/guilhermebirckholz/"},
    },
    {
      name: "João Pedro Igeski",
      role: "CEO",
      avatar: "JP",
      description:
        "Visionário e principal responsável pela direção e sucesso do sistema de gestão de bugs, assegurando que ele atenda às necessidades dos usuários e da organização.",
      social: { github: "https://github.com/jpedro1711", linkedin: "https://www.linkedin.com/in/joaopedroigeskimorais/"},
    },
    {
      name: "Luiz Gustavo Chimenes",
      role: "CTO",
      avatar: "LG",
      description:
        "Arquiteto e implementador das funcionalidades front-end e back-end do sistema de bug report, garantindo sua estabilidade, usabilidade e desempenho.",
      social: { github: "https://github.com/luizchimenes", linkedin: "https://www.linkedin.com/in/luiz-chimenes-dev/"},
    },
  ];

  const features = [
    {
      icon: <Bug className="w-6 h-6" />,
      title: "Rastreamento Completo",
      description:
        "Acompanhe defeitos desde a descoberta até a resolução final.",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Relatórios Detalhados",
      description:
        "Análises profundas com métricas e insights sobre qualidade.",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Colaboração em Equipe",
      description:
        "Facilite a comunicação entre desenvolvedores, testadores e gestores.",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fluxo Automatizado",
      description:
        "Processos inteligentes que aceleram a resolução de problemas.",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
  ];

  const systemFeatures = [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Classificação por Severidade",
      description:
        "Priorize defeitos automaticamente baseado no impacto no sistema.",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Sistema de Comentários",
      description: "Discussões contextuais para cada defeito reportado.",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Histórico Completo",
      description: "Rastreamento de todas as mudanças e ações realizadas.",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Fluxos Personalizáveis",
      description: "Adapte o sistema ao processo da sua equipe.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sobre o Sistema
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Conheça nossa plataforma de gerenciamento de bugs
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Bug className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <CardTitle className="text-2xl dark:text-white mb-4">
              Debugaê
            </CardTitle>
            <CardDescription className="text-lg max-w-3xl mx-auto">
              Uma solução completa para gerenciamento de defeitos, projetada
              para maximizar a qualidade do software e acelerar o processo de
              desenvolvimento.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center dark:text-white">
              <Target className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Nossa Missão
            </CardTitle>
            <CardDescription className="text-base mt-3">
              Desenvolver uma plataforma robusta e intuitiva que simplifique o
              processo de identificação, rastreamento e resolução de defeitos em
              software, promovendo maior qualidade e eficiência no
              desenvolvimento.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center dark:text-white">
              <Globe className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Nossa Visão
            </CardTitle>
            <CardDescription className="text-base mt-3">
              Ser a ferramenta de referência mundial para gerenciamento de
              defeitos, capacitando equipes de desenvolvimento a entregar
              software de alta qualidade de forma mais rápida e eficiente.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center dark:text-white">
              <Heart className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Nossos Valores
            </CardTitle>
            <CardDescription className="text-base mt-3">
              Qualidade, transparência, colaboração e melhoria contínua são os
              pilares que guiam o desenvolvimento de cada funcionalidade do
              nosso sistema.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl dark:text-white">
            <Settings className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" />
            Principais Funcionalidades
          </CardTitle>
        </CardHeader>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className={`p-3 ${feature.bgColor} rounded-lg`}>
                  {React.cloneElement(feature.icon, {
                    className: `w-6 h-6 ${feature.color}`,
                  })}
                </div>
                <div>
                  <h3 className={`font-semibold ${feature.color} mb-2`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl dark:text-white">
            <Bug className="w-6 h-6 mr-3 text-red-600" />
            Características do Sistema
          </CardTitle>
        </CardHeader>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  {React.cloneElement(feature.icon, {
                    className: "w-5 h-5 text-purple-600 dark:text-purple-400",
                  })}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl dark:text-white">
            <Users className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" />
            Nossa Equipe
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Conheça os profissionais por trás desta ferramenta
          </CardDescription>
        </CardHeader>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  {member.avatar}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium mb-2 text-sm">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {member.description}
                </p>
                <div className="flex justify-center space-x-2">
                  <a
                    href={member.social.github}
                    className="text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl dark:text-white">
            <Mail className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" />
            Suporte e Contato
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Precisa de ajuda ou tem sugestões? Entre em contato conosco
          </CardDescription>
        </CardHeader>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Email
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  suporte@bugreport.com
                </p>
              </div>
            </div>


            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Documentação
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Documentação dos endpoints
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              <Mail className="w-4 h-4 mr-2" />
              Entrar em Contato
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default About;
