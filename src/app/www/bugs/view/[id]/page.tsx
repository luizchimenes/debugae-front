"use client"

import { use } from "react";
import BugViewTemplate from "@/app/components/templates/bug/BugViewTemplate";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BugViewPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <ProtectedRoute>
      <BugViewTemplate bugId={id} />
    </ProtectedRoute>
  );
}