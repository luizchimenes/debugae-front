import React from 'react'
import DashboardHeader from '../../organism/DashboardHeader'
import { Card } from '../../atoms'
import { ThemeToggle } from '../../molecules/ThemeToggle'
import ProjectReport from '../../molecules/ProjectReport'

export interface ProjectReportTemplateProps {
  projectId: string;
}

const ProjectReportTemplate = (props: ProjectReportTemplateProps) => {
  return (
    <div className="bg-gradient-main dark:bg-gradient-main min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex items-center justify-center py-8">
        <Card className="w-full max-w-[1350px] mx-auto p-8 dark:bg-gray-800 rounded-lg shadow-md border border-primary">
          <ProjectReport projectId={props.projectId}/>
        </Card>
      </main>
      <ThemeToggle />
    </div>
  )
}

export default ProjectReportTemplate