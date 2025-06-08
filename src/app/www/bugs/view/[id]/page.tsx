"use client"

import BugViewTemplate from "@/app/components/templates/bug/BugViewTemplate";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

interface PageProps {
  params: {
    id: string;
  };
}

export default function BugViewPage({ params }: PageProps) {
  const { id } = params;

  return (
    <ProtectedRoute>
      <BugViewTemplate bugId={id} />;
    </ProtectedRoute>
  );
}
