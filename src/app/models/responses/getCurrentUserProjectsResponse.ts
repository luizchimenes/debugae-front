import { PagedResponse } from "./base/pagedResponse";
import { UserProject } from "../UserProject";

export interface GetCurrentUsersProject extends PagedResponse<UserProject>{
}