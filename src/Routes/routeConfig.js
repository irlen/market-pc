

const adminRoute = [
  {
    key:'/admin/dashboard',
    path:'/admin/dashboard',
    component:'',
    name:'面板',
    icon: 'fa fa-tachometer',
    routes:[
      { key:'/admin/dashboard/dashboardworkorder', path: '/admin/dashboard/dashboardworkorder', component:'../DashboardWorkOrder', name:'工单状态'},
      { key:'/admin/dashboard/dashboardconfig', path: '/admin/dashboard/dashboardconfig', component:'../DashboardConfig', name:'配置获取'}
    ]
  },
  {
    key:'/admin/order',
    path:'/admin/order',
    component:'',
    name:'工单',
    icon: 'fa fa-list-alt',
    routes:[
      { key:'/admin/order/orderlist', path: '/admin/order/orderlist', component:'../OrderList', name:'工单列表'},
      { key:'/admin/order/orderstrategy', path: '/admin/order/orderstrategy', component:'../OrderStrategy', name:'策略变更'},
      { key:'/admin/order/ordergroup', path: '/admin/order/ordergroup', component:'../OrderGroup', name:'对象组变更'},
    ]
  },
  {
    key:'/admin/record',
    path:'/admin/record',
    component:'',
    name:'变更',
    icon: 'fa fa-camera-retro',
    routes:[
      { key:'/admin/record/recordconfig', path: '/admin/record/recordconfig', component:'../RecordConfig', name:'记录'}
    ]
  },
  {
    key:'/admin/set',
    path:'/admin/set',
    component:'',
    name:'设置',
    icon: 'fa fa-cog',
    routes:[
      { key:'/admin/set/firedevice', path: '/admin/set/firedevice', component:'../FireDevice', name:'主机'},
      { key:'/admin/set/firesystem', path: '/admin/set/firesystem', component:'../FireSystem', name:'系统'},
    ]
  }
]
export { adminRoute }
