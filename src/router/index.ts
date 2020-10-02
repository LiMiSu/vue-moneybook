import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Main from '@/views/Main.vue';
import ManageTag from '@/components/Tag/ManageTag.vue';
import Statistics from '@/views/Statistics.vue';
import NotFound from '@/views/NotFound.vue';
import AddRewriteTag from '@/components/Tag/AddRewriteTag.vue';
import NumberPad from '@/components/AddMoney/NumberPad.vue';
import AddMoney from '@/views/AddMoney.vue';
import Detail from '@/views/Detail.vue';

Vue.use(VueRouter);

//push
const VueRouterPush: any = VueRouter.prototype.push
VueRouter.prototype.push = function push (to: any) {
  return VueRouterPush.call(this, to).catch((err: any) => err)
}

//replace
const VueRouterReplace: any  = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (to: any) {
  return VueRouterReplace.call(this, to).catch((err: any) => err)
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    component: Main
  },
  {
    path: '/managetag',
    component: ManageTag,
  },
  {
    path: '/addrewrite',
    component: AddRewriteTag
  },
  {
    path: '/addrewrite/:id',
    component: AddRewriteTag
  },
  {
    path: '/statistics',
    component: Statistics
  },
  {
    path: '/numberpad',
    component: NumberPad
  },
  {
    path: '/addmoney',
    component: AddMoney,

  },
  {
    path: '/addmoney/:id',
    component: AddMoney
  },
  {
    path: '/detail',
    component: Detail
  },
  {
    path: '*',
    component: NotFound
  }
];

const router = new VueRouter({
  routes
});



export default router;
