import { createRouter, createWebHistory } from "vue-router";
import { useAppStore } from "../store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/test",
    name: "测试",
    component: () => import("../views/Test.vue"),
  },
  {
    path: "/test2",
    name: "测试2",
    component: () => import("../views/Test2.vue"),
  },
];

const router = createRouter({
  // 设置基础路径，在 wujie 环境中使用主应用的路由前缀
  history: createWebHistory(
    window.__POWERED_BY_WUJIE__ ? "/subapp" : import.meta.env.BASE_URL
  ),
  routes,
});

// 路由守卫，可以在这里处理权限等逻辑
router.beforeEach((to, from, next) => {
  const appStore = useAppStore();
  // 如果是由主应用触发的路由变化，不再通知主应用
  if (appStore.isMainAppTriggered) {
    console.log("[子应用] 路由变化是由主应用触发的，不再通知主应用");
    appStore.setMainAppTriggered(false);
    next();
    return;
  }
  console.log("[子应用] 路由变化:", to);

  // 如果在微前端环境中，可以通知主应用路由变化
  if (window.__POWERED_BY_WUJIE__ && window.$wujie?.bus) {
    window?.$wujie?.bus?.$emit("subApp-route-change", {
      title: to?.name,
      path: to?.path,
    });
  }
  next();
});

export default router;
