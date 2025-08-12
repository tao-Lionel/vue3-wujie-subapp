import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    cors: true, // 允许跨域
    headers: {
      "Access-Control-Allow-Origin": "*", // 允许所有来源访问
    },
  },
  // 如果子应用需要部署在非根路径下，可以设置 base
  // base: '/subapp/'
});
