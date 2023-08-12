import { createRouter, createWebHistory } from 'vue-router'
import Title from '../components/Title.vue'
import Menu from '../components/Menu.vue'
import Board from '../components/Board.vue'
import Result from '../components/Result.vue'

const routes = [{
    path:"/",//pathを"/"にすると最初のrouterViewの中身になる
    name:"",
    component:Title
  },
  {
    path:"/Menu",
    name:"",
    component:Menu
  },
  {
    path:"/Board",
    name:"",
    component:Board
  },
  {
    path:"/Result",
    name:"",
    component:Result
  }]

const router = createRouter({
    history: createWebHistory(),
    routes
  })
  
export default router