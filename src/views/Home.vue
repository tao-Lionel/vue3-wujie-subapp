<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isWujieMode = ref(window.__POWERED_BY_WUJIE__ || false);
const appInfo = reactive({
  name: "Vue3子应用",
  version: "1.0.0",
  mode: isWujieMode.value ? "微前端模式" : "独立运行模式"
});

// 从主应用获取的数据
const mainAppData = ref(null);

// 功能卡片数据
const cards = ref([
  {
    id: 1,
    title: "业务功能一",
    icon: "Document",
    color: "#409EFF",
    route: "/test"
  },
  {
    id: 2,
    title: "业务功能二",
    icon: "Setting",
    color: "#67C23A",
    route: "/feature2"
  },
  {
    id: 3,
    title: "业务功能三",
    icon: "User",
    color: "#E6A23C",
    route: "/feature3"
  },
  {
    id: 4,
    title: "业务功能四",
    icon: "DataAnalysis",
    color: "#F56C6C",
    route: "/feature4"
  }
]);

// 通知消息
const notifications = ref([
  { id: 1, title: "系统通知", content: "欢迎使用微前端子应用", time: "刚刚" },
  { id: 2, title: "更新提醒", content: "系统将于今晚22:00进行更新维护", time: "10分钟前" }
]);

// 与主应用通信示例
const sendMessageToMain = () => {
  if (isWujieMode.value && window.$wujie?.bus) {
    window.$wujie.bus.$emit("subAppMessage", {
      from: "Home页面",
      content: "这是来自子应用Home页面的消息",
      timestamp: new Date().toLocaleString()
    });
  } else {
    console.log("当前为独立运行模式，无法与主应用通信");
  }
};

// 跳转到测试页面
const navigateToPage = (route) => {
  router.push(route);
};

onMounted(() => {
  console.log("Home页面已加载");
  
  // 如果在微前端模式下，尝试获取主应用数据
  if (isWujieMode.value && window.$wujie) {
    try {
      mainAppData.value = window.$wujie.props.data || {};
      console.log("从主应用获取的数据:", mainAppData.value);
    } catch (error) {
      console.error("获取主应用数据失败:", error);
    }
  }
});
</script>

<template>
  <div class="home-container">
    <!-- 应用信息头部 -->
    <div class="app-header">
      <h1>{{ appInfo.name }}</h1>
      <div class="app-mode">
        <el-tag :type="isWujieMode ? 'success' : 'info'">
          {{ appInfo.mode }}
        </el-tag>
      </div>
    </div>

    <!-- 主应用数据展示区 -->
    <div v-if="isWujieMode && mainAppData" class="main-app-data">
      <h3>主应用传递的数据</h3>
      <el-descriptions :column="2" border>
        <el-descriptions-item v-for="(value, key) in mainAppData" :key="key" :label="key">
          {{ typeof value === 'object' ? JSON.stringify(value) : value }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 功能卡片区域 -->
    <div class="feature-section">
      <h2>功能导航</h2>
      <div class="card-container">
        <div 
          v-for="card in cards" 
          :key="card.id" 
          class="feature-card"
          :style="{borderColor: card.color}"
          @click="navigateToPage(card.route)"
        >
          <div class="card-icon" :style="{backgroundColor: card.color}">
            <i :class="`el-icon-${card.icon.toLowerCase()}`"></i>
          </div>
          <div class="card-title">{{ card.title }}</div>
        </div>
      </div>
    </div>

    <!-- 通知区域 -->
    <div class="notification-section">
      <h2>系统通知</h2>
      <el-timeline>
        <el-timeline-item
          v-for="notification in notifications"
          :key="notification.id"
          :timestamp="notification.time"
          placement="top"
        >
          <el-card>
            <h4>{{ notification.title }}</h4>
            <p>{{ notification.content }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 微前端通信测试 -->
    <div class="communication-section">
      <h2>与主应用通信</h2>
      <el-button type="primary" @click="sendMessageToMain">发送消息到主应用</el-button>
      <p class="tip" v-if="!isWujieMode">当前为独立运行模式，无法与主应用通信</p>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.app-mode {
  font-size: 14px;
}

.main-app-data {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #409EFF;
}

.feature-section,
.notification-section,
.communication-section {
  margin-bottom: 30px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.feature-card {
  height: 120px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  border-top: 3px solid;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  color: white;
  font-size: 24px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
}

.tip {
  color: #909399;
  font-size: 14px;
  margin-top: 10px;
}
</style>