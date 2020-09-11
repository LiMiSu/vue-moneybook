import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Money from '@/views/Money.vue';
import Labels from '@/views/Labels.vue';
import Statistics from '@/views/Statistics.vue';
import NotFound from '@/views/NotFound.vue';
import EditLabel from '@/views/EditLabel.vue';
import NumberPad from '@/components/Money/NumberPad.vue';
import AddMoney from '@/views/AddMoney.vue';
import AddTags from '@/components/AddTags.vue';

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
    redirect: '/money'
  },
  {
    path: '/money',
    component: Money
  },
  {
    path: '/labels',
    component: Labels,
    children:[
      {
        path: '/addtags',
        component: AddTags,
      },
      {
        path: 'edit/:id',
        component: EditLabel
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
    path: '*',
    component: NotFound
  }
];

const router = new VueRouter({
  routes
});

export default router;
