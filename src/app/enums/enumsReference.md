OS ENUMS DEVEM TER OS MESMOS VALORES NUMERICOS QUE NO BACK-END
https://github.com/jpedro1711/debugae-backend/tree/main/GestaoDefeitos.Core/Enums

EXEMPO DO CONTRIBUTOR PROFESSION

export enum ContributorProfession {
  Developer = 1,
  Tester = 2,
  ProductOwner = 3,
  ScrumMaster = 4,
  BusinessAnalyst = 5,
  Architect = 6,
  DevOps = 7,
  Designer = 8,
  ProjectManager = 9,
  Other = 10,
}

using System.ComponentModel;

namespace GestaoDefeitos.Domain.Enums
{
    public enum ContributorProfession
    {
        [Description("Unknown")]
        Unknown = 0,
        [Description("Developer")]
        Developer = 1,
        [Description("Tester")]
        Tester = 2,
        [Description("Product Owner")]
        ProductOwner = 3,
        [Description("Scrum Master")]
        ScrumMaster = 4,
        [Description("Business Analyst")]
        BusinessAnalyst = 5,
        Architect = 6,
        [Description("DevOps")]
        DevOps = 7,
        [Description("Designer")]
        Designer = 8,
        [Description("Project Manager")]
        ProjectManager = 9,
        [Description("Other")]
        Other = 10
    }
}

AuthService.Register
const payload: CreateUserRequest = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password ?? "",
      department: userData.department,
      contributorProfession: ContributorProfession[userData.position as keyof typeof ContributorProfession]
    };