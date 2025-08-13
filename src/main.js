import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createPinia } from "pinia";
import { useAppStore } from "./store";

// 创建 Vue 实例
let app = null;

// 导出 wujie 生命周期钩子
const bootstrap = () => {
  console.log("[子应用] bootstrap 生命周期");
};

// 在 mount 函数中添加以下代码
const mount = () => {
  console.log("[子应用] mount 生命周期");

  if (window.__POWERED_BY_WUJIE__) {
    const { bus, props } = window.$wujie;

    // 可以从 props 中获取主应用传递的数据
    if (props) {
      const { data } = props;
      console.log("[子应用]从主应用获取的数据:", data);

      // 如果主应用传递了初始路由，可以在这里处理
      if (data && data.path) {
        router.push(data.path);
      }
    }

    // 监听主应用菜单切换
    bus.$on("main-route-change", (to) => {
      const { path } = to;
      console.log("[子应用] 接收到主应用路由通知:", path);

      // 创建应用实例后才能获取store
      const appStore = useAppStore();
      // 设置标记，表示此次路由变化是由主应用触发的
      appStore.setMainAppTriggered(true);

      // 只获取/subapp 后面的路径，包括在 /subapp 字符前面的也去掉
      let subAppPath = path.replace(/.*\/subapp/, "");
      console.log("[子应用] 转换后的路径:", subAppPath);

      // 根据主应用下发的路径进行跳转
      router.push(subAppPath);
    });

    // 向主应用发送消息
    // bus.$emit("从子应用发送消息", { msg: "子应用已加载完成" });
  }

  // 创建应用实例
  app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);
  app.use(router);
  app.use(ElementPlus);
  app.mount("#app");
};

const unmount = () => {
  console.log("[子应用] unmount 生命周期");
  app.unmount();
  app = null;
};

// 作为子应用导出生命周期钩子
if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = mount;
  window.__WUJIE_UNMOUNT = unmount;
  window.__WUJIE_BOOTSTRAP = bootstrap;
} else {
  // 独立运行时
  bootstrap();
  mount({});
}
