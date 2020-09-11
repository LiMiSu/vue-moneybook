import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Money from '@/views/Money.vue';
import Labels from '@/views/Labels.vue';
import Statistics from '@/views/Statistics.vue';
import NotFound from '@/views/NotFound.vue';
import EditLabel from '@/views/EditLabel.vue';
import NumberPad from '@/components/Money/NumberPad.vue';
import AddMoney from '@/views/AddMoney.vue';

Vue.use(VueRouter);

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
    component: Labels
  },
  {
    path: '/labels/edit/:id',
    component: EditLabel
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
    path: '*',
    component: NotFound
  }
];

const router = new VueRouter({
  routes
});

export default router;
