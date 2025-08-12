<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

// 模拟数据生成函数
const generateMockData = (count) => {
  const result = [];
  const statusOptions = [10, 11, 12, 13, 14, 15, 16];
  const issuedStatusOptions = [0, 1, 2, 3, 5];
  const contractStatusOptions = [1, 2, 3];
  const priceModelOptions = [1, 2];
  const currencyOptions = ["CNY", "USD", "EUR", "JPY"];
  const warehouseIds = ["W001", "W002", "W003"];
  const supplierNos = ["S001", "S002", "S003"];
  const corporationIds = ["C001", "C002", "C003"];

  const getStatusName = (status) => {
    const statusMap = {
      10: "待提审",
      11: "审核中",
      12: "审核不通过",
      13: "待收货",
      14: "部分收货",
      15: "已完结",
      16: "已作废",
    };
    return statusMap[status] || "未知状态";
  };

  const getIssuedStatusName = (status) => {
    const statusMap = {
      0: "待下发",
      1: "下发成功",
      2: "下发失败",
      3: "下发中",
      5: "无需下发",
    };
    return statusMap[status] || "未知状态";
  };

  for (let i = 1; i <= count; i++) {
    const status =
      statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const issuedStatus =
      issuedStatusOptions[
        Math.floor(Math.random() * issuedStatusOptions.length)
      ];
    const contractStatus =
      contractStatusOptions[
        Math.floor(Math.random() * contractStatusOptions.length)
      ];
    const priceModel =
      priceModelOptions[Math.floor(Math.random() * priceModelOptions.length)];
    const currency =
      currencyOptions[Math.floor(Math.random() * currencyOptions.length)];
    const warehouseId =
      warehouseIds[Math.floor(Math.random() * warehouseIds.length)];
    const supplierNo =
      supplierNos[Math.floor(Math.random() * supplierNos.length)];
    const corporationId =
      corporationIds[Math.floor(Math.random() * corporationIds.length)];

    const skuCount = Math.floor(Math.random() * 20) + 1;
    const totalNum = Math.floor(Math.random() * 1000) + 1;
    const amount = parseFloat((Math.random() * 100000).toFixed(2));

    const year = 2023;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);

    const createTime = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")} ${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;

    result.push({
      id: i,
      purchaseOrderNo: `PO${year}${month.toString().padStart(2, "0")}${day
        .toString()
        .padStart(2, "0")}${i.toString().padStart(3, "0")}`,
      purchasePlanCode: `PP${year}${month.toString().padStart(2, "0")}${day
        .toString()
        .padStart(2, "0")}${i.toString().padStart(3, "0")}`,
      poOrderStatusName: getStatusName(status),
      status,
      supplierName: `供应商${String.fromCharCode(65 + (i % 26))}`,
      supplierNo,
      corporationName: `采购组织${String.fromCharCode(65 + (i % 26))}`,
      corporationId,
      skuCount,
      totalNum,
      amount,
      createTime,
      purchasePlanner: `计划员${(i % 10) + 1}`,
      purchaser: `采购员${(i % 8) + 1}`,
      warehouseId,
      warehouseName:
        warehouseId === "W001"
          ? "仓库A"
          : warehouseId === "W002"
          ? "仓库B"
          : "仓库C",
      inboundStatus: Math.floor(Math.random() * 3),
      paymentStatus: Math.floor(Math.random() * 3),
      currency,
      priceModel,
      poContractNo:
        contractStatus === 3
          ? ""
          : `CT${year}${month.toString().padStart(2, "0")}${day
              .toString()
              .padStart(2, "0")}${i.toString().padStart(3, "0")}`,
      contractStatus,
      saleOrderIssuedSoonforStatus: issuedStatus,
      saleOrderIssuedSoonforStatusName: getIssuedStatusName(issuedStatus),
      remarks: i % 5 === 0 ? `重要订单${i}` : `测试备注${i}`,
    });
  }

  return result;
};

// 生成500条模拟数据
const mockTableData = generateMockData(500);

// 模拟API数据获取函数
const getPoOrderPageApi = (params) => {
  console.log("查询参数:", params);
  // 返回模拟数据
  return Promise.resolve({
    data: {
      code: 0,
      data: {
        records: mockTableData,
        total: mockTableData.length,
      },
    },
  });
};

// 模拟选项数据
const purchaseStatusOptions = ref([
  { label: "待提审", value: 10 },
  { label: "审核中", value: 11 },
  { label: "审核不通过", value: 12 },
  { label: "待收货", value: 13 },
  { label: "部分收货", value: 14 },
  { label: "已完结", value: 15 },
  { label: "已作废", value: 16 },
]);

const documentTypeOptions = ref([
  { label: "普通采购", value: 1 },
  { label: "紧急采购", value: 2 },
  { label: "计划采购", value: 3 },
]);

const purchaseAttrOptions = ref([
  { label: "常规", value: 1 },
  { label: "特殊", value: 2 },
]);

const paymentStatusOptions = ref([
  { label: "未付款", value: 0 },
  { label: "部分付款", value: 1 },
  { label: "已付款", value: 2 },
]);

const issuedSoonforStatusOptions = ref([
  { label: "待下发", value: 0 },
  { label: "下发成功", value: 1 },
  { label: "下发失败", value: 2 },
  { label: "下发中", value: 3 },
  { label: "无需下发", value: 5 },
]);

const poContractStatusOptions = ref([
  { label: "已生成", value: 1 },
  { label: "已作废", value: 2 },
  { label: "未生成", value: 3 },
]);

const priceModelOptions = ref([
  { label: "含税", value: 1 },
  { label: "不含税", value: 2 },
]);

const currencyOptions = ref([
  { currency: "CNY", currencyName: "人民币" },
  { currency: "USD", currencyName: "美元" },
  { currency: "EUR", currencyName: "欧元" },
  { currency: "JPY", currencyName: "日元" },
]);

const warehouseOptions = ref([
  { label: "仓库A", value: "W001" },
  { label: "仓库B", value: "W002" },
  { label: "仓库C", value: "W003" },
]);

const supplierOptions = ref([
  { label: "供应商A", value: "S001" },
  { label: "供应商B", value: "S002" },
  { label: "供应商C", value: "S003" },
]);

const corporationList = ref([
  { corporationId: "C001", corporationName: "采购组织A" },
  { corporationId: "C002", corporationName: "采购组织B" },
  { corporationId: "C003", corporationName: "采购组织C" },
]);

// 状态颜色
const poOrderStatusArrColor = {
  10: "#909399", // 待提审
  11: "#E6A23C", // 审核中
  12: "#F56C6C", // 审核不通过
  13: "#409EFF", // 待收货
  14: "#67C23A", // 部分收货
  15: "#67C23A", // 已完结
  16: "#909399", // 已作废
};

const saleOrderIssuedSoonforStatusArrColor = {
  0: "#E6A23C", // 待下发
  1: "#67C23A", // 下发成功
  2: "#F56C6C", // 下发失败
  3: "#409EFF", // 下发中
  5: "#909399", // 无需下发
};

// 响应式数据
const router = useRouter();
const tableData = ref([]);
const multipleSelection = ref([]);
const quantityTotal = ref(0);
const amountTotal = ref(0);

const searchForm = reactive({
  purchaseOrderNo: "",
  createTime: [],
  purchasePlanCode: "",
  corporationId: [],
  supplierNo: [],
  status: [],
  purchaseDocumentType: [],
  purchaseAttributes: [],
  skuCode: "",
  purchasePlanner: "",
  purchaser: "",
  warehouseId: [],
  inboundStatus: [],
  paymentStatus: [],
  currency: [],
  priceModel: [],
  poContractNo: "",
  contractStatus: [],
  saleOrderIssuedSoonforStatus: [],
});

const pagination = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 20,
});

// 计算属性
const pageReq = computed(() => {
  return { filtering: setFiltering(searchForm) };
});

// 模拟权限
const permissions = reactive({
  purchase_order_audit: true,
  purchase_order_push_factory: true,
  purchase_order_push_JE: true,
  purchase_order_end_document: true,
  purchase_order_export: true,
  purchase_order_createContract: true,
  purchase_order_cancel: true,
  purchase_order_edit: true,
  purchase_order_split: true,
  purchase_order_generate_prepaid_order: true,
});

// 方法
const setFiltering = (form) => {
  // 简化版的过滤处理
  const result = {};
  for (const key in form) {
    if (form[key] !== "" && form[key] !== null && form[key] !== undefined) {
      if (Array.isArray(form[key]) && form[key].length > 0) {
        result[key] = form[key];
      } else if (!Array.isArray(form[key])) {
        result[key] = form[key];
      }
    }
  }
  return result;
};

const setOrderBy = (column, defaultOrderBy) => {
  if (!column) return defaultOrderBy;

  return [
    {
      field: column.prop,
      order: column.order === "ascending" ? "asc" : "desc",
    },
  ];
};

// 获取列表数据
const getList = async (column = null) => {
  const params = {
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    filtering: setFiltering(searchForm),
    orderBy: setOrderBy(column, [{ field: "createTime", order: "desc" }]),
  };

  try {
    const { data } = await getPoOrderPageApi(params);
    if (data.code === 0) {
      tableData.value = data.data.records;
      pagination.total = data.data.total;
    }
  } catch (error) {
    console.error("获取列表数据失败:", error);
  }
};

// 表格操作方法
const handleSelectionChange = (selection) => {
  multipleSelection.value = selection;
  quantityTotal.value = selection.reduce((pre, cur) => pre + cur.totalNum, 0);
  amountTotal.value = selection
    .reduce((pre, cur) => pre + cur.amount, 0)
    .toFixed(2);
};

const handleSizeChange = (val) => {
  pagination.pageSize = val;
  getList();
};

const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  getList();
};

const handleSearch = () => {
  pagination.currentPage = 1;
  getList();
};

const handleReset = () => {
  // 重置表单
  for (const key in searchForm) {
    if (Array.isArray(searchForm[key])) {
      searchForm[key] = [];
    } else {
      searchForm[key] = "";
    }
  }
  handleSearch();
};

const handleSortChange = (column) => {
  getList(column);
};

// 按钮操作方法（保留方法名，不实现具体逻辑）
const handleAudit = (command) => {
  console.log("审核操作:", command);
};

const handlePushFactory = () => {
  console.log("下发数夫");
};

const handlePushJE = () => {
  console.log("下发巨益");
};

const handleEndDocument = () => {
  console.log("完结单据");
};

const handleCreateContract = (row) => {
  console.log("生成合同:", row);
};

const handleBatchCancel = () => {
  console.log("批量作废");
};

const handleShowSkuInfo = (purchaseOrderNo) => {
  console.log("查看采购明细:", purchaseOrderNo);
};

const getOADetail = (row) => {
  console.log("获取OA详情:", row);
};

const handleEditRemark = (row) => {
  console.log("编辑备注:", row);
};

const updateList = () => {
  multipleSelection.value = [];
  getList();
};

// 生命周期钩子
onMounted(() => {
  getList();
});
</script>

<template>
  <div>
    <div class="container">
      <!-- 表格上方统计信息 -->
      <div class="statistics-info">
        <span>采购总数量：{{ quantityTotal }}</span>
        <span style="margin-left: 30px">采购总金额：{{ amountTotal }}</span>
      </div>

      <!-- 操作按钮区域 -->
      <div class="operation-buttons">
        <el-dropdown
          v-if="permissions.purchase_order_audit"
          split-button
          type="primary"
          @command="handleAudit"
        >
          提交审核
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="反审核">反审核</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button
          v-if="permissions.purchase_order_push_factory"
          type="primary"
          size="small"
          @click="handlePushFactory"
        >
          下发数夫
        </el-button>

        <el-button
          v-if="permissions.purchase_order_push_JE"
          type="primary"
          @click="handlePushJE"
        >
          下发巨益
        </el-button>

        <el-button
          v-if="permissions.purchase_order_end_document"
          type="primary"
          @click="handleEndDocument"
        >
          完结单据
        </el-button>

        <el-dropdown v-if="permissions.purchase_order_export">
          <el-button type="primary">
            导出<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>导出列表</el-dropdown-item>
              <el-dropdown-item>导出明细</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button
          v-if="permissions.purchase_order_createContract"
          style="margin-left: 10px"
          type="primary"
          @click="handleCreateContract(null)"
        >
          生成合同
        </el-button>

        <el-button
          v-if="permissions.purchase_order_cancel"
          style="margin-left: 10px"
          type="primary"
          @click="handleBatchCancel"
        >
          批量作废
        </el-button>
      </div>

      <!-- 搜索表单 -->
      <el-form :model="searchForm" inline @submit.prevent="handleSearch">
        <el-form-item prop="purchaseOrderNo">
          <el-input
            v-model="searchForm.purchaseOrderNo"
            clearable
            placeholder="采购单号"
          ></el-input>
        </el-form-item>

        <el-form-item prop="createTime">
          <el-date-picker
            v-model="searchForm.createTime"
            type="daterange"
            clearable
            start-placeholder="单据开始日期"
            end-placeholder="单据结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>

        <el-form-item prop="purchasePlanCode">
          <el-input
            v-model="searchForm.purchasePlanCode"
            clearable
            placeholder="采购计划号"
          ></el-input>
        </el-form-item>

        <el-form-item prop="corporationId">
          <el-select
            v-model="searchForm.corporationId"
            placeholder="采购组织"
            filterable
            clearable
            multiple
          >
            <el-option
              v-for="item in corporationList"
              :key="item.corporationId"
              :label="item.corporationName"
              :value="item.corporationId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="supplierNo">
          <el-select
            v-model="searchForm.supplierNo"
            placeholder="供应商"
            filterable
            clearable
            multiple
          >
            <el-option
              v-for="item in supplierOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="text">高级搜索</el-button>
        </el-form-item>
      </el-form>

      <!-- 高级搜索表单 -->
      <el-collapse>
        <el-collapse-item title="高级搜索" name="1">
          <el-form :model="searchForm" inline>
            <el-form-item prop="status">
              <el-select
                v-model="searchForm.status"
                placeholder="采购状态"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in purchaseStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="purchaseDocumentType">
              <el-select
                v-model="searchForm.purchaseDocumentType"
                placeholder="单据类型"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in documentTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="purchaseAttributes">
              <el-select
                v-model="searchForm.purchaseAttributes"
                placeholder="采购单属性"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in purchaseAttrOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="skuCode">
              <el-input
                v-model="searchForm.skuCode"
                clearable
                placeholder="工厂SKU"
              ></el-input>
            </el-form-item>

            <el-form-item prop="purchasePlanner">
              <el-input
                v-model="searchForm.purchasePlanner"
                clearable
                placeholder="采购计划员"
              ></el-input>
            </el-form-item>

            <el-form-item prop="purchaser">
              <el-input
                v-model="searchForm.purchaser"
                clearable
                placeholder="采购员"
              ></el-input>
            </el-form-item>

            <el-form-item prop="warehouseId">
              <el-select
                v-model="searchForm.warehouseId"
                filterable
                clearable
                multiple
                placeholder="入库仓"
              >
                <el-option
                  v-for="item in warehouseOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="inboundStatus">
              <el-select
                v-model="searchForm.inboundStatus"
                multiple
                clearable
                filterable
                placeholder="入库状态"
              >
                <el-option label="未入库" value="0"></el-option>
                <el-option label="全部入库" value="2"></el-option>
                <el-option label="部分入库" value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="paymentStatus">
              <el-select
                v-model="searchForm.paymentStatus"
                multiple
                clearable
                filterable
                placeholder="付款状态"
              >
                <el-option
                  v-for="item in paymentStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="currency">
              <el-select
                v-model="searchForm.currency"
                clearable
                placeholder="币别"
                multiple
                filterable
              >
                <el-option
                  v-for="item in currencyOptions"
                  :key="item.currency"
                  :label="item.currency"
                  :value="item.currency"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="priceModel">
              <el-select
                v-model="searchForm.priceModel"
                clearable
                multiple
                filterable
                placeholder="价格模式"
              >
                <el-option
                  v-for="item in priceModelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="poContractNo">
              <el-input
                v-model="searchForm.poContractNo"
                clearable
                placeholder="合同编号"
              ></el-input>
            </el-form-item>

            <el-form-item prop="contractStatus">
              <el-select
                v-model="searchForm.contractStatus"
                clearable
                multiple
                collapse-tags
                filterable
                placeholder="合同状态"
              >
                <el-option
                  v-for="item in poContractStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="saleOrderIssuedSoonforStatus">
              <el-select
                v-model="searchForm.saleOrderIssuedSoonforStatus"
                placeholder="下发数夫状态"
                filterable
                clearable
                multiple
              >
                <el-option
                  v-for="item in issuedSoonforStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>

      <!-- 数据表格 -->
      <div class="table-container">
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="55" />

          <el-table-column
            prop="purchasePlanCode"
            label="采购计划号"
            min-width="150"
          >
            <template #default="{ row }">
              <router-link
                :to="{
                  path: '/',
                  query: { purchasePlanCode: row.purchasePlanCode },
                }"
              >
                {{ row.purchasePlanCode }}
              </router-link>
            </template>
          </el-table-column>

          <el-table-column
            prop="purchaseOrderNo"
            label="采购单号"
            min-width="150"
          >
            <template #default="{ row }">
              <router-link
                :to="{
                  path: '/',
                  query: { purchaserOrderNo: row.purchaseOrderNo },
                }"
              >
                {{ row.purchaseOrderNo }}
              </router-link>
            </template>
          </el-table-column>

          <el-table-column
            prop="poOrderStatusName"
            label="采购状态"
            min-width="100"
          >
            <template #default="{ row }">
              <span :style="{ color: poOrderStatusArrColor[row.status] }">
                {{ row.poOrderStatusName }}
              </span>
              <a @click="getOADetail(row)"
                ><el-icon><link /></el-icon
              ></a>
            </template>
          </el-table-column>

          <el-table-column prop="skuCount" label="商品种数" min-width="100">
            <template #default="{ row }">
              <a
                v-if="row.skuCount > 0"
                @click="handleShowSkuInfo(row.purchaseOrderNo)"
              >
                {{ row.skuCount }}笔
              </a>
              <span v-else>{{ row.skuCount }}笔</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="saleOrderIssuedSoonforStatusName"
            label="下发数夫状态"
            min-width="120"
          >
            <template #default="{ row }">
              <span
                :style="{
                  color:
                    saleOrderIssuedSoonforStatusArrColor[
                      row.saleOrderIssuedSoonforStatus
                    ],
                }"
              >
                {{ row.saleOrderIssuedSoonforStatusName }}
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="poContractNo" label="合同编号" min-width="150">
            <template #default="{ row }">
              <router-link to="/" :title="row.poContractNo">
                {{ row.poContractNo }}
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="priceModel" label="价格模式" min-width="100">
            <template #default="{ row }">
              {{
                priceModelOptions.find((item) => item.value === row.priceModel)
                  ?.label
              }}
            </template>
          </el-table-column>

          <el-table-column prop="supplierName" label="供应商" min-width="150" />
          <el-table-column
            prop="corporationName"
            label="采购组织"
            min-width="150"
          />
          <el-table-column prop="totalNum" label="采购数量" min-width="100" />
          <el-table-column prop="amount" label="采购金额" min-width="100" />
          <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="150"
            sortable="custom"
          />

          <el-table-column label="操作" fixed="right" min-width="150">
            <template #default="{ row }">
              <el-dropdown>
                <el-button type="primary"
                  >操作<el-icon class="el-icon--right"><arrow-down /></el-icon
                ></el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-if="
                        [10, 12].includes(Number(row.status)) &&
                        permissions.purchase_order_edit
                      "
                      @click="
                        router.push({
                          path: '/purchase/poorder/edit',
                          query: {
                            id: row.id,
                            purchaserOrderNo: row.purchaseOrderNo,
                            type: 'edit',
                          },
                        })
                      "
                    >
                      编辑
                    </el-dropdown-item>

                    <el-dropdown-item
                      v-if="
                        [10, 12, 13].includes(Number(row.status)) &&
                        permissions.purchase_order_split
                      "
                      @click="
                        router.push({
                          path: '/purchase/poorder/split',
                          query: {
                            id: row.id,
                            purchaserOrderNo: row.purchaseOrderNo,
                            type: 'split',
                          },
                        })
                      "
                    >
                      拆分采购订单
                    </el-dropdown-item>

                    <el-dropdown-item
                      v-if="
                        permissions.purchase_order_createContract &&
                        [13, 14, 15].includes(row.status) &&
                        [3].includes(row.contractStatus)
                      "
                      @click="handleCreateContract(row)"
                    >
                      生成合同
                    </el-dropdown-item>

                    <el-dropdown-item
                      v-if="permissions.purchase_order_generate_prepaid_order"
                      @click="createRequestAndPre(row)"
                    >
                      生成预付单
                    </el-dropdown-item>

                    <el-dropdown-item @click="handleEditRemark(row)">
                      编辑备注
                    </el-dropdown-item>

                    <el-dropdown-item
                      v-if="
                        permissions.purchase_order_cancel &&
                        ![16, 15].includes(Number(row.status))
                      "
                      @click="handleCancel(row)"
                    >
                      作废
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<style>
.container {
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 16px;
  overflow: hidden; /* 防止内容溢出 */
}

.statistics-info {
  position: relative;
  font-size: 14px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  gap: 30px;
}

.operation-buttons {
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px 0;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 8px 0;
  border-top: 1px solid #ebeef5;
}

/* 表格容器样式，添加水平滚动 */
.table-container {
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
  padding-bottom: 8px; /* 为滚动条预留空间 */
}

/* 美化表单样式 */
:deep(.el-form) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
  margin-right: 0;
}

/* 高级搜索区域样式 */
:deep(.el-collapse) {
  border: none;
  margin-bottom: 16px;
}

:deep(.el-collapse-item__header) {
  font-size: 14px;
  color: #409eff;
  border-bottom: none;
  padding: 0 8px;
}

:deep(.el-collapse-item__content) {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: bold;
}

:deep(.el-dropdown-menu__item) {
  line-height: 30px;
  padding: 0 20px;
  font-size: 14px;
}

/* 链接样式 */
:deep(a) {
  color: #409eff;
  text-decoration: none;
}

:deep(a:hover) {
  color: #66b1ff;
  text-decoration: underline;
}
</style>
