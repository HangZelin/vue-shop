import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message, Container,Progress,
  Header, Aside, Main, Menu, MenuItem, Submenu, Breadcrumb,
  BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip,Steps,Step,
  Pagination, Dialog, MessageBox ,Tag ,Tree ,Select,Option,Cascader,
  Alert,Tabs,TabPane,Checkbox,CheckboxGroup,Upload,Timeline,TimelineItem,Radio,RadioGroup,DatePicker,Divider,Transfer,InputNumber,Popover,Drawer,Calendar,Dropdown,DropdownMenu,DropdownItem
} from 'element-ui'
//全局注册
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(DatePicker)
Vue.use(Divider)
Vue.use(Transfer)
Vue.use(InputNumber)
Vue.use(Popover)
Vue.use(Drawer)
Vue.use(Calendar)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Progress)

Vue.prototype.$message = Message //Message挂载到Vue的原型组件，用this.$message就可以调用
Vue.prototype.$confirm = MessageBox.confirm
