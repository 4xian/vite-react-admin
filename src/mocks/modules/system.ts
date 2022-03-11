import { MockMethod } from 'vite-plugin-mock'
import Mock, { Random } from 'mockjs'
import { SystemType } from '#/system'

Random.extend({
  permissions: () => {
    return Random.pick(['管理员', '普通用户', '超级管理员'])
  },
  project: () => {
    return Random.pick([['项目一', '项目二'], ['项目二'], ['项目一', '项目二', '项目三']])
  },
  phone: () => {
    const prefix = ['132', '135', '189']
    return Random.pick(prefix) + Mock.mock(/\d{8}/)
  },
  sex: () => {
    return Random.pick([0, 1])
  },
  roles: () => {
    return Random.pick([
      ['201', '202', '20'],
      ['201', '202', '20', '1', '21', '211', '212'],
      ['21', '211', '212']
    ])
  }
})

const staff_List = (): SystemType.StaffDetail[] => {
  const arr: any = []
  for (let idx = 0; idx < 12; idx++) {
    arr.push(
      Mock.mock({
        id: Random.integer(100, 10000),
        staffNo: Random.integer(100, 10000),
        name: Random.cname(),
        role: '@permissions',
        createTime: Random.date('yyyy-MM-dd HH:mm:ss'),
        project: '@project',
        phone: '@phone',
        sex: '@sex',
        age: Random.integer(10, 100)
      })
    )
  }
  return arr
}

const role_List = () => {
  const v: any = []
  for (let idx = 0; idx < 3; idx++) {
    v.push(
      Mock.mock({
        id: Random.integer(100, 10000),
        role: '@permissions',
        permission: '@roles',
        createTime: Random.date('yyyy-MM-dd HH:mm:ss'),
        updateTime: Random.date('yyyy-MM-dd HH:mm:ss')
      })
    )
  }
  return v
}
const project_List = () => {
  return [
    {
      id: '123',
      project: '项目一'
    },
    {
      id: '12345',
      project: '项目二'
    },
    {
      id: '1236',
      project: '项目三'
    },
    {
      id: '12687345',
      project: '项目四'
    }
  ]
}

const permission_List = () => {
  return [
    {
      id: '1',
      name: '新物管运营平台',
      children: [
        {
          id: '20',
          name: '项目管理',
          children: [
            {
              id: '201',
              name: '项目配置',
              children: []
            },
            {
              id: '202',
              name: '项目区域管理',
              children: []
            }
          ]
        },
        {
          id: '21',
          name: '系统管理',
          children: [
            {
              id: '211',
              name: '员工管理',
              children: []
            },
            {
              id: '212',
              name: '角色管理',
              children: []
            }
          ]
        }
      ]
    }
  ]
}

/* 角色相关 */
export const rolesList: MockMethod[] = [
  // 获取角色列表
  {
    url: '/api/getRoleList',
    method: 'get',
    statusCode: 200,
    response: (): any => {
      return {
        code: '00000',
        message: '获取成功',
        data: {
          list: role_List,
          total: role_List.length
        }
      }
    }
  },
  // 获取权限母版
  {
    url: '/api/getAllPermission',
    method: 'get',
    statusCode: 200,
    response: (): any => {
      return {
        code: '00000',
        message: '获取成功',
        data: {
          list: permission_List
        }
      }
    }
  }
]

/* 员工相关 */
export const staffList: MockMethod[] = [
  // 获取员工列表
  {
    url: '/api/getStaffList',
    method: 'get',
    statusCode: 200,
    response: (): any => {
      return {
        code: '00000',
        message: '获取成功',
        data: {
          list: staff_List,
          total: staff_List.length
        }
      }
    }
  },
  // 获取关联项目
  {
    url: '/api/getProjectList',
    method: 'get',
    statusCode: 200,
    response: (): any => {
      return {
        code: '00000',
        message: '获取成功',
        data: {
          list: project_List
        }
      }
    }
  }
]
