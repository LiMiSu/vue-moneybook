import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Main from '@/views/Main.vue';
import ManageTag from '@/components/Tag/ManageTag.vue';
import Statistics from '@/views/Statistics.vue';
import NotFound from '@/views/NotFound.vue';
import RewriteTag from '@/components/Tag/RewriteTag.vue';
import NumberPad from '@/components/AddMoney/NumberPad.vue';
import AddMoney from '@/views/AddMoney.vue';
import AddTags from '@/components/Tag/AddTag.vue';
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
    children:[
      {
        path: '/addtags',
        component: AddTags,
      },
      {
        path: 'rewrite/:id',
        component: RewriteTag
      }
    ]
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
    component: AddMoney
  },
  {
    path: '/addtags',
    component: AddTags
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
