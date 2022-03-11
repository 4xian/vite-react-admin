export declare namespace SystemType {
  type PageParams = {
    pageNum: number
    pageSize: number
  }
  /* 员工类型 */
  type GetStaffParams = {
    pageNum: number
    pageSize: number
    keyWord?: string
    project?: string
  }
  type StaffDetail = {
    id: string
    staffNo: string
    name: string
    phone: number | string
    role: string
    project: string[]
    createTime: string
    sex?: 0 | 1
    age?: number | string
  }
  /* 角色类型 */
  type RoleTreeType = {
    id: string
    name: string
    children: RoleTreeType[]
    key: string | number
    title: string
  }
  type RoleDetail = {
    roleId: string
    roleName: string
    createTime: string
    updateTime: string
    permission: string[]
  }
}
