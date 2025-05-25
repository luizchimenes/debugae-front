"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/atoms/CardComponent";
import { useState } from "react";

const DashboardBugView = () => {
  return (
    <Card className="w-full mx-auto p-8 m-4 dark:bg-gray-800 rounded-lg shadow-md border border-primary">
      <CardHeader>
        <CardTitle>Meus defeitos</CardTitle>
      </CardHeader>
      <hr />
      <CardContent></CardContent>
    </Card>
  );
};

export default DashboardBugView;
