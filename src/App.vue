<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const appName = ref("子应用");

// 监听主应用传递的路由变化
onMounted(() => {
  // if (window.__POWERED_BY_WUJIE__) {
  //   // 监听主应用下发的路由变化信息
  //   window.$wujie?.bus.$on("main-route-change", (path) => {
  //     console.log("[子应用] 接收到主应用路由通知:", path);
  //     // 根据主应用下发的路径进行跳转
  //     if (path && !path.startsWith("/subapp")) {
  //       // 确保路径格式正确，避免重复的 /subapp 前缀
  //       router.push(path);
  //     }
  //   });
  // }
});

onUnmounted(() => {
  if (window.__POWERED_BY_WUJIE__) {
    // 解除事件监听
    window.$wujie?.bus.$off("main-route-change");
  }
});
</script>

<template>
  <div class="app-wujie">
    <div v-if="$wujie?.isRunInWujie" class="subapp-info">
      {{ appName }} - 微前端模式
    </div>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.app-wujie {
  width: 100%;
  height: 100%;
}

.subapp-info {
  padding: 8px;
  background-color: #f0f9ff;
  color: #409eff;
  font-size: 14px;
}
</style>
