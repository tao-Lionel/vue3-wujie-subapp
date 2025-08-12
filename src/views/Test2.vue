<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElNotification } from "element-plus";

const router = useRouter();
const isWujieMode = ref(window.__POWERED_BY_WUJIE__ || false);
const mainAppData = ref(null);
const messageHistory = ref([]);

// 测试状态数据
const testState = reactive({
  // 基础测试数据
  userName: "测试用户2",
  userAge: 25,
  isActive: true,
  selectedCity: "上海",
  hobbies: ["阅读", "运动"],

  // 表单测试数据
  formData: {
    title: "",
    content: "",
    priority: "medium",
    tags: [],
    deadline: null,
    isPublic: false,
  },

  // 列表测试数据
  tableData: [
    { id: 1, name: "张三", age: 28, city: "北京", status: "active" },
    { id: 2, name: "李四", age: 32, city: "上海", status: "inactive" },
    { id: 3, name: "王五", age: 25, city: "广州", status: "active" },
  ],

  // 统计数据
  statistics: {
    totalUsers: 0,
    activeUsers: 0,
    messageCount: 0,
    lastUpdate: new Date().toLocaleString(),
  },
});

// 选项数据
const options = {
  cities: [
    { value: "北京", label: "北京" },
    { value: "上海", label: "上海" },
    { value: "广州", label: "广州" },
    { value: "深圳", label: "深圳" },
  ],
  priorities: [
    { value: "low", label: "低优先级" },
    { value: "medium", label: "中优先级" },
    { value: "high", label: "高优先级" },
  ],
  tags: [
    { value: "工作", label: "工作" },
    { value: "学习", label: "学习" },
    { value: "生活", label: "生活" },
    { value: "娱乐", label: "娱乐" },
  ],
};

// 计算属性
const activeUsersCount = computed(() => {
  return testState.tableData.filter((user) => user.status === "active").length;
});

const formIsValid = computed(() => {
  return (
    testState.formData.title.trim() !== "" &&
    testState.formData.content.trim() !== ""
  );
});

// 微前端通信相关方法
const sendMessageToMain = (type, data) => {
  if (!isWujieMode.value || !window.$wujie?.bus) {
    ElMessage.warning("当前为独立运行模式，无法与主应用通信");
    return;
  }

  const message = {
    from: "Test2页面",
    type,
    data,
    timestamp: new Date().toISOString(),
  };

  window.$wujie.bus.$emit("subAppMessage", message);

  // 记录消息历史
  messageHistory.value.unshift({
    direction: "发送",
    type,
    content: data,
    time: new Date().toLocaleTimeString(),
  });

  ElMessage.success(`已发送${type}消息到主应用`);
};

const handleMainAppMessage = (message) => {
  console.log("收到主应用消息:", message);

  // 记录消息历史
  messageHistory.value.unshift({
    direction: "接收",
    type: message.type || "unknown",
    content: message.data || message,
    time: new Date().toLocaleTimeString(),
  });

  // 根据消息类型处理
  if (message && message.type) {
    switch (message.type) {
      case "update-user-info":
        if (message.data) {
          testState.userName = message.data.userName || testState.userName;
          testState.userAge = message.data.userAge || testState.userAge;
        }
        ElNotification({
          title: "用户信息更新",
          message: "已接收主应用的用户信息更新",
          type: "success",
        });
        break;
      case "route-change":
        if (message.data && message.data.path) {
          router.push(message.data.path);
        }
        break;
      case "refresh-data":
        refreshStatistics();
        ElMessage.success("数据已刷新");
        break;
      default:
        ElNotification({
          title: "收到主应用消息",
          message: JSON.stringify(message),
          type: "info",
        });
    }
  }
};

// 业务逻辑方法
const addUser = () => {
  const newUser = {
    id: testState.tableData.length + 1,
    name: `用户${testState.tableData.length + 1}`,
    age: Math.floor(Math.random() * 40) + 20,
    city: options.cities[Math.floor(Math.random() * options.cities.length)]
      .value,
    status: Math.random() > 0.5 ? "active" : "inactive",
  };

  testState.tableData.push(newUser);
  refreshStatistics();

  // 通知主应用
  sendMessageToMain("user-added", newUser);
};

const deleteUser = (id) => {
  const index = testState.tableData.findIndex((user) => user.id === id);
  if (index > -1) {
    const deletedUser = testState.tableData.splice(index, 1)[0];
    refreshStatistics();

    // 通知主应用
    sendMessageToMain("user-deleted", {
      id: deletedUser.id,
      name: deletedUser.name,
    });

    ElMessage.success(`已删除用户: ${deletedUser.name}`);
  }
};

const toggleUserStatus = (user) => {
  user.status = user.status === "active" ? "inactive" : "active";
  refreshStatistics();

  // 通知主应用
  sendMessageToMain("user-status-changed", {
    id: user.id,
    name: user.name,
    status: user.status,
  });
};

const submitForm = () => {
  if (!formIsValid.value) {
    ElMessage.error("请填写完整的表单信息");
    return;
  }

  const formDataCopy = { ...testState.formData };

  // 模拟提交
  ElMessage.success("表单提交成功");

  // 通知主应用
  sendMessageToMain("form-submitted", formDataCopy);

  // 重置表单
  testState.formData = {
    title: "",
    content: "",
    priority: "medium",
    tags: [],
    deadline: null,
    isPublic: false,
  };
};

const refreshStatistics = () => {
  testState.statistics = {
    totalUsers: testState.tableData.length,
    activeUsers: activeUsersCount.value,
    messageCount: messageHistory.value.length,
    lastUpdate: new Date().toLocaleString(),
  };
};

const clearMessageHistory = () => {
  messageHistory.value = [];
  refreshStatistics();
  ElMessage.success("消息历史已清空");
};

const testRouteNavigation = () => {
  router.push("/test");
};

const testNotification = () => {
  ElNotification({
    title: "测试通知",
    message: "这是一个来自Test2页面的测试通知消息",
    type: "info",
    duration: 3000,
  });
};

const exportData = () => {
  const exportData = {
    users: testState.tableData,
    statistics: testState.statistics,
    messageHistory: messageHistory.value,
    timestamp: new Date().toISOString(),
  };

  // 模拟导出
  console.log("导出数据:", exportData);

  // 通知主应用
  sendMessageToMain("data-exported", exportData);

  ElMessage.success("数据导出成功，请查看控制台");
};

onMounted(() => {
  console.log("Test2页面已加载");

  // 初始化统计数据
  refreshStatistics();

  // 如果在微前端模式下，设置通信
  if (isWujieMode.value && window.$wujie) {
    try {
      // 获取主应用传递的数据
      mainAppData.value = window.$wujie.props?.data || {};
      console.log("从主应用获取的数据:", mainAppData.value);

      // 监听主应用消息
      window.$wujie.bus.$on("main-to-subapp-message", handleMainAppMessage);

      // 向主应用发送页面加载完成消息
      sendMessageToMain("page-loaded", {
        page: "Test2",
        userCount: testState.tableData.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("微前端通信设置失败:", error);
    }
  }
});

onUnmounted(() => {
  // 清理事件监听
  if (isWujieMode.value && window.$wujie) {
    try {
      window.$wujie.bus.$off("main-to-subapp-message", handleMainAppMessage);
    } catch (error) {
      console.error("移除事件监听失败:", error);
    }
  }
});
</script>

<template>
  <div class="test-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>微前端子应用测试页面 - Test2</h1>
      <div class="header-actions">
        <el-tag :type="isWujieMode ? 'success' : 'info'">
          {{ isWujieMode ? "微前端模式" : "独立运行模式" }}
        </el-tag>
        <el-tag type="warning"
          >当前路由: {{ router.currentRoute.value.path }}</el-tag
        >
        <el-button type="primary" @click="testNotification">测试通知</el-button>
        <el-button @click="testRouteNavigation">路由跳转</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="statistics-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ testState.statistics.totalUsers }}</div>
          <div class="stat-label">总用户数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ testState.statistics.activeUsers }}</div>
          <div class="stat-label">活跃用户</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ testState.statistics.messageCount }}</div>
          <div class="stat-label">消息数量</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-time">{{ testState.statistics.lastUpdate }}</div>
          <div class="stat-label">最后更新</div>
        </div>
      </el-card>
    </div>

    <!-- 主应用数据展示 -->
    <el-card
      v-if="isWujieMode && mainAppData && Object.keys(mainAppData).length > 0"
      class="main-data-card"
    >
      <template #header>
        <h3>主应用传递的数据</h3>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item
          v-for="(value, key) in mainAppData"
          :key="key"
          :label="key"
        >
          {{ typeof value === "object" ? JSON.stringify(value) : value }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 用户信息表单 -->
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <h3>用户信息 - Test2</h3>
          <el-button
            type="primary"
            @click="
              sendMessageToMain('user-info-sync', {
                userName: testState.userName,
                userAge: testState.userAge,
              })
            "
          >
            同步到主应用
          </el-button>
        </div>
      </template>

      <el-form :model="testState" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名">
              <el-input
                v-model="testState.userName"
                placeholder="请输入用户名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄">
              <el-input-number
                v-model="testState.userAge"
                :min="1"
                :max="120"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态">
              <el-switch
                v-model="testState.isActive"
                active-text="活跃"
                inactive-text="非活跃"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市">
              <el-select
                v-model="testState.selectedCity"
                placeholder="请选择城市"
              >
                <el-option
                  v-for="city in options.cities"
                  :key="city.value"
                  :label="city.label"
                  :value="city.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 表单测试 -->
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <h3>表单测试</h3>
          <el-button
            type="success"
            :disabled="!formIsValid"
            @click="submitForm"
          >
            提交表单
          </el-button>
        </div>
      </template>

      <el-form :model="testState.formData" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标题" required>
              <el-input
                v-model="testState.formData.title"
                placeholder="请输入标题"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级">
              <el-select
                v-model="testState.formData.priority"
                placeholder="请选择优先级"
              >
                <el-option
                  v-for="priority in options.priorities"
                  :key="priority.value"
                  :label="priority.label"
                  :value="priority.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="内容" required>
          <el-input
            v-model="testState.formData.content"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标签">
              <el-select
                v-model="testState.formData.tags"
                multiple
                placeholder="请选择标签"
              >
                <el-option
                  v-for="tag in options.tags"
                  :key="tag.value"
                  :label="tag.label"
                  :value="tag.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止日期">
              <el-date-picker
                v-model="testState.formData.deadline"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="公开">
          <el-switch
            v-model="testState.formData.isPublic"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <h3>用户列表</h3>
          <div>
            <el-button type="primary" @click="addUser">添加用户</el-button>
            <el-button @click="exportData">导出数据</el-button>
          </div>
        </div>
      </template>

      <el-table :data="testState.tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="city" label="城市" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === "active" ? "活跃" : "非活跃" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="toggleUserStatus(row)">
              {{ row.status === "active" ? "禁用" : "启用" }}
            </el-button>
            <el-button size="small" type="danger" @click="deleteUser(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 通信历史 -->
    <el-card class="message-card">
      <template #header>
        <div class="card-header">
          <h3>通信历史</h3>
          <el-button @click="clearMessageHistory">清空历史</el-button>
        </div>
      </template>

      <el-empty v-if="messageHistory.length === 0" description="暂无通信记录" />

      <el-timeline v-else>
        <el-timeline-item
          v-for="(message, index) in messageHistory.slice(0, 10)"
          :key="index"
          :type="message.direction === '发送' ? 'primary' : 'success'"
          :timestamp="message.time"
          placement="top"
        >
          <el-card>
            <h4>
              {{
                message.direction === "发送" ? "发送到主应用" : "接收自主应用"
              }}
              - {{ message.type }}
            </h4>
            <pre>{{ JSON.stringify(message.content, null, 2) }}</pre>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<style scoped>
.test-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.statistics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 10px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stat-time {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.main-data-card,
.form-card,
.table-card,
.message-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

pre {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

.el-timeline {
  max-height: 400px;
  overflow-y: auto;
}
</style>
