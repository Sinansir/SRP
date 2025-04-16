// mock/_course-metadata.bundled_1744297528975_tilzfun0jmk.mjs
var courseNatures = [
  { id: 1, code: "BX", name: "\u5FC5\u4FEE", status: 1, sort: 1, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" },
  { id: 2, code: "XX", name: "\u9009\u4FEE", status: 1, sort: 2, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" },
  { id: 3, code: "XB", name: "\u9650\u5FC5", status: 1, sort: 3, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" },
  { id: 4, code: "TX", name: "\u901A\u9009", status: 1, sort: 4, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" },
  { id: 5, code: "ZX", name: "\u4E13\u9009", status: 0, sort: 5, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" }
];
var courseCategories = [
  { id: 1, code: "GC", name: "\u516C\u5171\u57FA\u7840\u8BFE", status: 1, sort: 1, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" },
  { id: 2, code: "ZJ", name: "\u4E13\u4E1A\u57FA\u7840\u8BFE", status: 1, sort: 2, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" },
  { id: 3, code: "ZY", name: "\u4E13\u4E1A\u8BFE", status: 1, sort: 3, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" },
  { id: 4, code: "SJ", name: "\u5B9E\u8DF5\u6559\u5B66", status: 1, sort: 4, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" },
  { id: 5, code: "TX", name: "\u901A\u8BC6\u9009\u4FEE\u8BFE", status: 1, sort: 5, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" },
  { id: 6, code: "JX", name: "\u96C6\u4E2D\u5B9E\u8DF5", status: 0, sort: 6, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" }
];
var examTypes = [
  { id: 1, code: "KS", name: "\u8003\u8BD5", status: 1, sort: 1, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" },
  { id: 2, code: "KC", name: "\u8003\u67E5", status: 1, sort: 2, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" },
  { id: 3, code: "LW", name: "\u8BBA\u6587", status: 1, sort: 3, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" },
  { id: 4, code: "SJ", name: "\u8BBE\u8BA1", status: 1, sort: 4, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" },
  { id: 5, code: "CZ", name: "\u64CD\u4F5C", status: 0, sort: 5, createTime: "2023-01-01 00:00:00", updateTime: "2023-01-01 00:00:00" }
];
var course_metadata_default = [
  // 获取课程性质列表
  {
    url: "/api/course/nature/list",
    method: "get",
    response: ({ query }) => {
      const { pageSize = 10, pageIndex = 1, name = "", code = "", status = "" } = query;
      let filteredList = [...courseNatures];
      if (name) {
        filteredList = filteredList.filter((item) => item.name.includes(name));
      }
      if (code) {
        filteredList = filteredList.filter((item) => item.code.includes(code));
      }
      if (status !== "") {
        filteredList = filteredList.filter((item) => item.status === parseInt(status, 10));
      }
      const start = (pageIndex - 1) * pageSize;
      const end = pageIndex * pageSize;
      const list = filteredList.slice(start, end);
      return {
        code: 0,
        data: {
          list,
          total: filteredList.length
        },
        message: "ok"
      };
    }
  },
  // 添加课程性质
  {
    url: "/api/course/nature/add",
    method: "post",
    response: ({ body }) => {
      const { name, code } = body;
      const existingItem = courseNatures.find((item) => item.code === code);
      if (existingItem) {
        return {
          code: 1,
          message: "\u8BFE\u7A0B\u6027\u8D28\u4EE3\u7801\u5DF2\u5B58\u5728"
        };
      }
      const newId = courseNatures.length > 0 ? Math.max(...courseNatures.map((item) => item.id)) + 1 : 1;
      const newItem = {
        id: newId,
        name,
        code,
        status: 1,
        sort: courseNatures.length + 1,
        createTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
        updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
      };
      courseNatures.push(newItem);
      return {
        code: 0,
        data: newItem,
        message: "\u6DFB\u52A0\u6210\u529F"
      };
    }
  },
  // 修改课程性质
  {
    url: "/api/course/nature/update",
    method: "put",
    response: ({ body }) => {
      const { id, name, code, status, sort } = body;
      const index = courseNatures.findIndex((item) => item.id === id);
      if (index === -1) {
        return {
          code: 1,
          message: "\u8BFE\u7A0B\u6027\u8D28\u4E0D\u5B58\u5728"
        };
      }
      const duplicateCode = courseNatures.find((item) => item.code === code && item.id !== id);
      if (duplicateCode) {
        return {
          code: 1,
          message: "\u8BFE\u7A0B\u6027\u8D28\u4EE3\u7801\u5DF2\u5B58\u5728"
        };
      }
      courseNatures[index] = {
        ...courseNatures[index],
        name,
        code,
        status: typeof status === "number" ? status : courseNatures[index].status,
        sort: typeof sort === "number" ? sort : courseNatures[index].sort,
        updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
      };
      return {
        code: 0,
        data: courseNatures[index],
        message: "\u66F4\u65B0\u6210\u529F"
      };
    }
  },
  // 删除课程性质
  {
    url: "/api/course/nature/delete/:id",
    method: "delete",
    response: ({ params }) => {
      const id = parseInt(params.id, 10);
      const index = courseNatures.findIndex((item) => item.id === id);
      if (index === -1) {
        return {
          code: 1,
          message: "\u8BFE\u7A0B\u6027\u8D28\u4E0D\u5B58\u5728"
        };
      }
      courseNatures.splice(index, 1);
      return {
        code: 0,
        message: "\u5220\u9664\u6210\u529F"
      };
    }
  },
  // 同步课程性质
  {
    url: "/api/course/nature/sync",
    method: "post",
    response: () => {
      return {
        code: 0,
        message: "\u540C\u6B65\u6210\u529F",
        data: {
          added: 2,
          updated: 1,
          failed: 0
        }
      };
    }
  },
  // 获取课程类别列表
  {
    url: "/api/course/category/list",
    method: "get",
    response: ({ query }) => {
      const { pageSize = 10, pageIndex = 1, name = "", code = "", status = "" } = query;
      let filteredList = [...courseCategories];
      if (name) {
        filteredList = filteredList.filter((item) => item.name.includes(name));
      }
      if (code) {
        filteredList = filteredList.filter((item) => item.code.includes(code));
      }
      if (status !== "") {
        filteredList = filteredList.filter((item) => item.status === parseInt(status, 10));
      }
      const start = (pageIndex - 1) * pageSize;
      const end = pageIndex * pageSize;
      const list = filteredList.slice(start, end);
      return {
        code: 0,
        data: {
          list,
          total: filteredList.length
        },
        message: "ok"
      };
    }
  },
  // 添加课程类别
  {
    url: "/api/course/category/add",
    method: "post",
    response: ({ body }) => {
      const { name, code } = body;
      const existingItem = courseCategories.find((item) => item.code === code);
      if (existingItem) {
        return {
          code: 1,
          message: "\u8BFE\u7A0B\u7C7B\u522B\u4EE3\u7801\u5DF2\u5B58\u5728"
        };
      }
      const newId = courseCategories.length > 0 ? Math.max(...courseCategories.map((item) => item.id)) + 1 : 1;
      const newItem = {
        id: newId,
        name,
        code,
        status: 1,
        sort: courseCategories.length + 1,
        createTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
        updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
      };
      courseCategories.push(newItem);
      return {
        code: 0,
        data: newItem,
        message: "\u6DFB\u52A0\u6210\u529F"
      };
    }
  },
  // 修改课程类别
  {
    url: "/api/course/category/update",
    method: "put",
    response: ({ body }) => {
      const { id, name, code, status, sort } = body;
      const index = courseCategories.findIndex((item) => item.id === id);
      if (index === -1) {
        return {
          code: 1,
          message: "\u8BFE\u7A0B\u7C7B\u522B\u4E0D\u5B58\u5728"
        };
      }
      const duplicateCode = courseCategories.find((item) => item.code === code && item.id !== id);
      if (duplicateCode) {
        return {
          code: 1,
          message: "\u8BFE\u7A0B\u7C7B\u522B\u4EE3\u7801\u5DF2\u5B58\u5728"
        };
      }
      courseCategories[index] = {
        ...courseCategories[index],
        name,
        code,
        status: typeof status === "number" ? status : courseCategories[index].status,
        sort: typeof sort === "number" ? sort : courseCategories[index].sort,
        updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
      };
      return {
        code: 0,
        data: courseCategories[index],
        message: "\u66F4\u65B0\u6210\u529F"
      };
    }
  },
  // 删除课程类别
  {
    url: "/api/course/category/delete/:id",
    method: "delete",
    response: ({ params }) => {
      const id = parseInt(params.id, 10);
      const index = courseCategories.findIndex((item) => item.id === id);
      if (index === -1) {
        return {
          code: 1,
          message: "\u8BFE\u7A0B\u7C7B\u522B\u4E0D\u5B58\u5728"
        };
      }
      courseCategories.splice(index, 1);
      return {
        code: 0,
        message: "\u5220\u9664\u6210\u529F"
      };
    }
  },
  // 同步课程类别
  {
    url: "/api/course/category/sync",
    method: "post",
    response: () => {
      return {
        code: 0,
        message: "\u540C\u6B65\u6210\u529F",
        data: {
          added: 3,
          updated: 2,
          failed: 0
        }
      };
    }
  },
  // 获取考试形式列表
  {
    url: "/api/course/exam-type/list",
    method: "get",
    response: ({ query }) => {
      const { pageSize = 10, pageIndex = 1, name = "", code = "", status = "" } = query;
      let filteredList = [...examTypes];
      if (name) {
        filteredList = filteredList.filter((item) => item.name.includes(name));
      }
      if (code) {
        filteredList = filteredList.filter((item) => item.code.includes(code));
      }
      if (status !== "") {
        filteredList = filteredList.filter((item) => item.status === parseInt(status, 10));
      }
      const start = (pageIndex - 1) * pageSize;
      const end = pageIndex * pageSize;
      const list = filteredList.slice(start, end);
      return {
        code: 0,
        data: {
          list,
          total: filteredList.length
        },
        message: "ok"
      };
    }
  },
  // 添加考试形式
  {
    url: "/api/course/exam-type/add",
    method: "post",
    response: ({ body }) => {
      const { name, code } = body;
      const existingItem = examTypes.find((item) => item.code === code);
      if (existingItem) {
        return {
          code: 1,
          message: "\u8003\u8BD5\u5F62\u5F0F\u4EE3\u7801\u5DF2\u5B58\u5728"
        };
      }
      const newId = examTypes.length > 0 ? Math.max(...examTypes.map((item) => item.id)) + 1 : 1;
      const newItem = {
        id: newId,
        name,
        code,
        status: 1,
        sort: examTypes.length + 1,
        createTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
        updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
      };
      examTypes.push(newItem);
      return {
        code: 0,
        data: newItem,
        message: "\u6DFB\u52A0\u6210\u529F"
      };
    }
  },
  // 修改考试形式
  {
    url: "/api/course/exam-type/update",
    method: "put",
    response: ({ body }) => {
      const { id, name, code, status, sort } = body;
      const index = examTypes.findIndex((item) => item.id === id);
      if (index === -1) {
        return {
          code: 1,
          message: "\u8003\u8BD5\u5F62\u5F0F\u4E0D\u5B58\u5728"
        };
      }
      const duplicateCode = examTypes.find((item) => item.code === code && item.id !== id);
      if (duplicateCode) {
        return {
          code: 1,
          message: "\u8003\u8BD5\u5F62\u5F0F\u4EE3\u7801\u5DF2\u5B58\u5728"
        };
      }
      examTypes[index] = {
        ...examTypes[index],
        name,
        code,
        status: typeof status === "number" ? status : examTypes[index].status,
        sort: typeof sort === "number" ? sort : examTypes[index].sort,
        updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
      };
      return {
        code: 0,
        data: examTypes[index],
        message: "\u66F4\u65B0\u6210\u529F"
      };
    }
  },
  // 删除考试形式
  {
    url: "/api/course/exam-type/delete/:id",
    method: "delete",
    response: ({ params }) => {
      const id = parseInt(params.id, 10);
      const index = examTypes.findIndex((item) => item.id === id);
      if (index === -1) {
        return {
          code: 1,
          message: "\u8003\u8BD5\u5F62\u5F0F\u4E0D\u5B58\u5728"
        };
      }
      examTypes.splice(index, 1);
      return {
        code: 0,
        message: "\u5220\u9664\u6210\u529F"
      };
    }
  },
  // 同步考试形式
  {
    url: "/api/course/exam-type/sync",
    method: "post",
    response: () => {
      return {
        code: 0,
        message: "\u540C\u6B65\u6210\u529F",
        data: {
          added: 1,
          updated: 3,
          failed: 0
        }
      };
    }
  }
];
export {
  course_metadata_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibW9jay9tb2NrL2NvdXJzZS1tZXRhZGF0YS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxIQy5SXFxcXERlc2t0b3BcXFxcY2hhdFxcXFxTUlBcXFxcTlNSUFxcXFxSUFxcXFxtb2NrXFxcXGNvdXJzZS1tZXRhZGF0YS50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxIQy5SXFxcXERlc2t0b3BcXFxcY2hhdFxcXFxTUlBcXFxcTlNSUFxcXFxSUFxcXFxtb2NrXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9DOi9Vc2Vycy9IQy5SL0Rlc2t0b3AvY2hhdC9TUlAvTlNSUC9SUC9tb2NrL2NvdXJzZS1tZXRhZGF0YS50c1wiO2ltcG9ydCB7IE1vY2tNZXRob2QgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJztcclxuXHJcbi8vIFx1OEJGRVx1N0EwQlx1NjAyN1x1OEQyOFx1NTIxN1x1ODg2OFxyXG5jb25zdCBjb3Vyc2VOYXR1cmVzID0gW1xyXG4gIHsgaWQ6IDEsIGNvZGU6ICdCWCcsIG5hbWU6ICdcdTVGQzVcdTRGRUUnLCBzdGF0dXM6IDEsIHNvcnQ6IDEsIGNyZWF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJywgdXBkYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnIH0sXHJcbiAgeyBpZDogMiwgY29kZTogJ1hYJywgbmFtZTogJ1x1OTAwOVx1NEZFRScsIHN0YXR1czogMSwgc29ydDogMiwgY3JlYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnLCB1cGRhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcgfSxcclxuICB7IGlkOiAzLCBjb2RlOiAnWEInLCBuYW1lOiAnXHU5NjUwXHU1RkM1Jywgc3RhdHVzOiAxLCBzb3J0OiAzLCBjcmVhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcsIHVwZGF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJyB9LFxyXG4gIHsgaWQ6IDQsIGNvZGU6ICdUWCcsIG5hbWU6ICdcdTkwMUFcdTkwMDknLCBzdGF0dXM6IDEsIHNvcnQ6IDQsIGNyZWF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJywgdXBkYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnIH0sXHJcbiAgeyBpZDogNSwgY29kZTogJ1pYJywgbmFtZTogJ1x1NEUxM1x1OTAwOScsIHN0YXR1czogMCwgc29ydDogNSwgY3JlYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnLCB1cGRhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcgfVxyXG5dO1xyXG5cclxuLy8gXHU4QkZFXHU3QTBCXHU3QzdCXHU1MjJCXHU1MjE3XHU4ODY4XHJcbmNvbnN0IGNvdXJzZUNhdGVnb3JpZXMgPSBbXHJcbiAgeyBpZDogMSwgY29kZTogJ0dDJywgbmFtZTogJ1x1NTE2Q1x1NTE3MVx1NTdGQVx1Nzg0MFx1OEJGRScsIHN0YXR1czogMSwgc29ydDogMSwgY3JlYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnLCB1cGRhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcgfSxcclxuICB7IGlkOiAyLCBjb2RlOiAnWkonLCBuYW1lOiAnXHU0RTEzXHU0RTFBXHU1N0ZBXHU3ODQwXHU4QkZFJywgc3RhdHVzOiAxLCBzb3J0OiAyLCBjcmVhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcsIHVwZGF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJyB9LFxyXG4gIHsgaWQ6IDMsIGNvZGU6ICdaWScsIG5hbWU6ICdcdTRFMTNcdTRFMUFcdThCRkUnLCBzdGF0dXM6IDEsIHNvcnQ6IDMsIGNyZWF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJywgdXBkYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnIH0sXHJcbiAgeyBpZDogNCwgY29kZTogJ1NKJywgbmFtZTogJ1x1NUI5RVx1OERGNVx1NjU1OVx1NUI2NicsIHN0YXR1czogMSwgc29ydDogNCwgY3JlYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnLCB1cGRhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcgfSxcclxuICB7IGlkOiA1LCBjb2RlOiAnVFgnLCBuYW1lOiAnXHU5MDFBXHU4QkM2XHU5MDA5XHU0RkVFXHU4QkZFJywgc3RhdHVzOiAxLCBzb3J0OiA1LCBjcmVhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcsIHVwZGF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJyB9LFxyXG4gIHsgaWQ6IDYsIGNvZGU6ICdKWCcsIG5hbWU6ICdcdTk2QzZcdTRFMkRcdTVCOUVcdThERjUnLCBzdGF0dXM6IDAsIHNvcnQ6IDYsIGNyZWF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJywgdXBkYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnIH1cclxuXTtcclxuXHJcbi8vIFx1ODAwM1x1OEJENVx1NUY2Mlx1NUYwRlx1NTIxN1x1ODg2OFxyXG5jb25zdCBleGFtVHlwZXMgPSBbXHJcbiAgeyBpZDogMSwgY29kZTogJ0tTJywgbmFtZTogJ1x1ODAwM1x1OEJENScsIHN0YXR1czogMSwgc29ydDogMSwgY3JlYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnLCB1cGRhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcgfSxcclxuICB7IGlkOiAyLCBjb2RlOiAnS0MnLCBuYW1lOiAnXHU4MDAzXHU2N0U1Jywgc3RhdHVzOiAxLCBzb3J0OiAyLCBjcmVhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcsIHVwZGF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJyB9LFxyXG4gIHsgaWQ6IDMsIGNvZGU6ICdMVycsIG5hbWU6ICdcdThCQkFcdTY1ODcnLCBzdGF0dXM6IDEsIHNvcnQ6IDMsIGNyZWF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJywgdXBkYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnIH0sXHJcbiAgeyBpZDogNCwgY29kZTogJ1NKJywgbmFtZTogJ1x1OEJCRVx1OEJBMScsIHN0YXR1czogMSwgc29ydDogNCwgY3JlYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnLCB1cGRhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcgfSxcclxuICB7IGlkOiA1LCBjb2RlOiAnQ1onLCBuYW1lOiAnXHU2NENEXHU0RjVDJywgc3RhdHVzOiAwLCBzb3J0OiA1LCBjcmVhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcsIHVwZGF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJyB9XHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBbXHJcbiAgLy8gXHU4M0I3XHU1M0Q2XHU4QkZFXHU3QTBCXHU2MDI3XHU4RDI4XHU1MjE3XHU4ODY4XHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UvbmF0dXJlL2xpc3QnLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBxdWVyeSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgcGFnZVNpemUgPSAxMCwgcGFnZUluZGV4ID0gMSwgbmFtZSA9ICcnLCBjb2RlID0gJycsIHN0YXR1cyA9ICcnIH0gPSBxdWVyeTtcclxuICAgICAgXHJcbiAgICAgIGxldCBmaWx0ZXJlZExpc3QgPSBbLi4uY291cnNlTmF0dXJlc107XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTdCNUJcdTkwMDlcclxuICAgICAgaWYgKG5hbWUpIHtcclxuICAgICAgICBmaWx0ZXJlZExpc3QgPSBmaWx0ZXJlZExpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5uYW1lLmluY2x1ZGVzKG5hbWUpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY29kZSkge1xyXG4gICAgICAgIGZpbHRlcmVkTGlzdCA9IGZpbHRlcmVkTGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLmNvZGUuaW5jbHVkZXMoY29kZSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChzdGF0dXMgIT09ICcnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uc3RhdHVzID09PSBwYXJzZUludChzdGF0dXMsIDEwKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFx1NTIwNlx1OTg3NVxyXG4gICAgICBjb25zdCBzdGFydCA9IChwYWdlSW5kZXggLSAxKSAqIHBhZ2VTaXplO1xyXG4gICAgICBjb25zdCBlbmQgPSBwYWdlSW5kZXggKiBwYWdlU2l6ZTtcclxuICAgICAgY29uc3QgbGlzdCA9IGZpbHRlcmVkTGlzdC5zbGljZShzdGFydCwgZW5kKTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBsaXN0LFxyXG4gICAgICAgICAgdG90YWw6IGZpbHRlcmVkTGlzdC5sZW5ndGgsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlOiAnb2snLFxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG4gIFxyXG4gIC8vIFx1NkRGQlx1NTJBMFx1OEJGRVx1N0EwQlx1NjAyN1x1OEQyOFxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY291cnNlL25hdHVyZS9hZGQnLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKHsgYm9keSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgbmFtZSwgY29kZSB9ID0gYm9keTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxyXG4gICAgICBjb25zdCBleGlzdGluZ0l0ZW0gPSBjb3Vyc2VOYXR1cmVzLmZpbmQoaXRlbSA9PiBpdGVtLmNvZGUgPT09IGNvZGUpO1xyXG4gICAgICBpZiAoZXhpc3RpbmdJdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGNvZGU6IDEsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnXHU4QkZFXHU3QTBCXHU2MDI3XHU4RDI4XHU0RUUzXHU3ODAxXHU1REYyXHU1QjU4XHU1NzI4JyxcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTY1QjBcdTU4OUVcclxuICAgICAgY29uc3QgbmV3SWQgPSBjb3Vyc2VOYXR1cmVzLmxlbmd0aCA+IDAgPyBNYXRoLm1heCguLi5jb3Vyc2VOYXR1cmVzLm1hcChpdGVtID0+IGl0ZW0uaWQpKSArIDEgOiAxO1xyXG4gICAgICBjb25zdCBuZXdJdGVtID0ge1xyXG4gICAgICAgIGlkOiBuZXdJZCxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIGNvZGUsXHJcbiAgICAgICAgc3RhdHVzOiAxLFxyXG4gICAgICAgIHNvcnQ6IGNvdXJzZU5hdHVyZXMubGVuZ3RoICsgMSxcclxuICAgICAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnVCcsICcgJykuc3Vic3RyaW5nKDAsIDE5KSxcclxuICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnVCcsICcgJykuc3Vic3RyaW5nKDAsIDE5KSxcclxuICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgIGNvdXJzZU5hdHVyZXMucHVzaChuZXdJdGVtKTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBkYXRhOiBuZXdJdGVtLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdcdTZERkJcdTUyQTBcdTYyMTBcdTUyOUYnLFxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG4gIFxyXG4gIC8vIFx1NEZFRVx1NjUzOVx1OEJGRVx1N0EwQlx1NjAyN1x1OEQyOFxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY291cnNlL25hdHVyZS91cGRhdGUnLFxyXG4gICAgbWV0aG9kOiAncHV0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH0pID0+IHtcclxuICAgICAgY29uc3QgeyBpZCwgbmFtZSwgY29kZSwgc3RhdHVzLCBzb3J0IH0gPSBib2R5O1xyXG4gICAgICBcclxuICAgICAgLy8gXHU2N0U1XHU2MjdFXHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gY291cnNlTmF0dXJlcy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLmlkID09PSBpZCk7XHJcbiAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgY29kZTogMSxcclxuICAgICAgICAgIG1lc3NhZ2U6ICdcdThCRkVcdTdBMEJcdTYwMjdcdThEMjhcdTRFMERcdTVCNThcdTU3MjgnLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NEVFM1x1NzgwMVx1NjYyRlx1NTQyNlx1NURGMlx1ODhBQlx1NTE3Nlx1NEVENlx1OEJCMFx1NUY1NVx1NEY3Rlx1NzUyOFxyXG4gICAgICBjb25zdCBkdXBsaWNhdGVDb2RlID0gY291cnNlTmF0dXJlcy5maW5kKGl0ZW0gPT4gaXRlbS5jb2RlID09PSBjb2RlICYmIGl0ZW0uaWQgIT09IGlkKTtcclxuICAgICAgaWYgKGR1cGxpY2F0ZUNvZGUpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgY29kZTogMSxcclxuICAgICAgICAgIG1lc3NhZ2U6ICdcdThCRkVcdTdBMEJcdTYwMjdcdThEMjhcdTRFRTNcdTc4MDFcdTVERjJcdTVCNThcdTU3MjgnLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFx1NjZGNFx1NjVCMFxyXG4gICAgICBjb3Vyc2VOYXR1cmVzW2luZGV4XSA9IHtcclxuICAgICAgICAuLi5jb3Vyc2VOYXR1cmVzW2luZGV4XSxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIGNvZGUsXHJcbiAgICAgICAgc3RhdHVzOiB0eXBlb2Ygc3RhdHVzID09PSAnbnVtYmVyJyA/IHN0YXR1cyA6IGNvdXJzZU5hdHVyZXNbaW5kZXhdLnN0YXR1cyxcclxuICAgICAgICBzb3J0OiB0eXBlb2Ygc29ydCA9PT0gJ251bWJlcicgPyBzb3J0IDogY291cnNlTmF0dXJlc1tpbmRleF0uc29ydCxcclxuICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnVCcsICcgJykuc3Vic3RyaW5nKDAsIDE5KSxcclxuICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBkYXRhOiBjb3Vyc2VOYXR1cmVzW2luZGV4XSxcclxuICAgICAgICBtZXNzYWdlOiAnXHU2NkY0XHU2NUIwXHU2MjEwXHU1MjlGJyxcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBcclxuICAvLyBcdTUyMjBcdTk2NjRcdThCRkVcdTdBMEJcdTYwMjdcdThEMjhcclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS9uYXR1cmUvZGVsZXRlLzppZCcsXHJcbiAgICBtZXRob2Q6ICdkZWxldGUnLFxyXG4gICAgcmVzcG9uc2U6ICh7IHBhcmFtcyB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IGlkID0gcGFyc2VJbnQocGFyYW1zLmlkLCAxMCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTY3RTVcdTYyN0VcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcclxuICAgICAgY29uc3QgaW5kZXggPSBjb3Vyc2VOYXR1cmVzLmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IGlkKTtcclxuICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBjb2RlOiAxLFxyXG4gICAgICAgICAgbWVzc2FnZTogJ1x1OEJGRVx1N0EwQlx1NjAyN1x1OEQyOFx1NEUwRFx1NUI1OFx1NTcyOCcsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gXHU1MjIwXHU5NjY0XHJcbiAgICAgIGNvdXJzZU5hdHVyZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBtZXNzYWdlOiAnXHU1MjIwXHU5NjY0XHU2MjEwXHU1MjlGJyxcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBcclxuICAvLyBcdTU0MENcdTZCNjVcdThCRkVcdTdBMEJcdTYwMjdcdThEMjhcclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS9uYXR1cmUvc3luYycsXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBtZXNzYWdlOiAnXHU1NDBDXHU2QjY1XHU2MjEwXHU1MjlGJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBhZGRlZDogMixcclxuICAgICAgICAgIHVwZGF0ZWQ6IDEsXHJcbiAgICAgICAgICBmYWlsZWQ6IDAsXHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG4gIFxyXG4gIC8vIFx1ODNCN1x1NTNENlx1OEJGRVx1N0EwQlx1N0M3Qlx1NTIyQlx1NTIxN1x1ODg2OFxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY291cnNlL2NhdGVnb3J5L2xpc3QnLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBxdWVyeSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgcGFnZVNpemUgPSAxMCwgcGFnZUluZGV4ID0gMSwgbmFtZSA9ICcnLCBjb2RlID0gJycsIHN0YXR1cyA9ICcnIH0gPSBxdWVyeTtcclxuICAgICAgXHJcbiAgICAgIGxldCBmaWx0ZXJlZExpc3QgPSBbLi4uY291cnNlQ2F0ZWdvcmllc107XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTdCNUJcdTkwMDlcclxuICAgICAgaWYgKG5hbWUpIHtcclxuICAgICAgICBmaWx0ZXJlZExpc3QgPSBmaWx0ZXJlZExpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5uYW1lLmluY2x1ZGVzKG5hbWUpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY29kZSkge1xyXG4gICAgICAgIGZpbHRlcmVkTGlzdCA9IGZpbHRlcmVkTGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLmNvZGUuaW5jbHVkZXMoY29kZSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChzdGF0dXMgIT09ICcnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uc3RhdHVzID09PSBwYXJzZUludChzdGF0dXMsIDEwKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFx1NTIwNlx1OTg3NVxyXG4gICAgICBjb25zdCBzdGFydCA9IChwYWdlSW5kZXggLSAxKSAqIHBhZ2VTaXplO1xyXG4gICAgICBjb25zdCBlbmQgPSBwYWdlSW5kZXggKiBwYWdlU2l6ZTtcclxuICAgICAgY29uc3QgbGlzdCA9IGZpbHRlcmVkTGlzdC5zbGljZShzdGFydCwgZW5kKTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBsaXN0LFxyXG4gICAgICAgICAgdG90YWw6IGZpbHRlcmVkTGlzdC5sZW5ndGgsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlOiAnb2snLFxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG4gIFxyXG4gIC8vIFx1NkRGQlx1NTJBMFx1OEJGRVx1N0EwQlx1N0M3Qlx1NTIyQlxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY291cnNlL2NhdGVnb3J5L2FkZCcsXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH0pID0+IHtcclxuICAgICAgY29uc3QgeyBuYW1lLCBjb2RlIH0gPSBib2R5O1xyXG4gICAgICBcclxuICAgICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4XHJcbiAgICAgIGNvbnN0IGV4aXN0aW5nSXRlbSA9IGNvdXJzZUNhdGVnb3JpZXMuZmluZChpdGVtID0+IGl0ZW0uY29kZSA9PT0gY29kZSk7XHJcbiAgICAgIGlmIChleGlzdGluZ0l0ZW0pIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgY29kZTogMSxcclxuICAgICAgICAgIG1lc3NhZ2U6ICdcdThCRkVcdTdBMEJcdTdDN0JcdTUyMkJcdTRFRTNcdTc4MDFcdTVERjJcdTVCNThcdTU3MjgnLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFx1NjVCMFx1NTg5RVxyXG4gICAgICBjb25zdCBuZXdJZCA9IGNvdXJzZUNhdGVnb3JpZXMubGVuZ3RoID4gMCA/IE1hdGgubWF4KC4uLmNvdXJzZUNhdGVnb3JpZXMubWFwKGl0ZW0gPT4gaXRlbS5pZCkpICsgMSA6IDE7XHJcbiAgICAgIGNvbnN0IG5ld0l0ZW0gPSB7XHJcbiAgICAgICAgaWQ6IG5ld0lkLFxyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgY29kZSxcclxuICAgICAgICBzdGF0dXM6IDEsXHJcbiAgICAgICAgc29ydDogY291cnNlQ2F0ZWdvcmllcy5sZW5ndGggKyAxLFxyXG4gICAgICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKCdUJywgJyAnKS5zdWJzdHJpbmcoMCwgMTkpLFxyXG4gICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKCdUJywgJyAnKS5zdWJzdHJpbmcoMCwgMTkpLFxyXG4gICAgICB9O1xyXG4gICAgICBcclxuICAgICAgY291cnNlQ2F0ZWdvcmllcy5wdXNoKG5ld0l0ZW0pO1xyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBjb2RlOiAwLFxyXG4gICAgICAgIGRhdGE6IG5ld0l0ZW0sXHJcbiAgICAgICAgbWVzc2FnZTogJ1x1NkRGQlx1NTJBMFx1NjIxMFx1NTI5RicsXHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgXHJcbiAgLy8gXHU0RkVFXHU2NTM5XHU4QkZFXHU3QTBCXHU3QzdCXHU1MjJCXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UvY2F0ZWdvcnkvdXBkYXRlJyxcclxuICAgIG1ldGhvZDogJ3B1dCcsXHJcbiAgICByZXNwb25zZTogKHsgYm9keSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgaWQsIG5hbWUsIGNvZGUsIHN0YXR1cywgc29ydCB9ID0gYm9keTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NjdFNVx1NjI3RVx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxyXG4gICAgICBjb25zdCBpbmRleCA9IGNvdXJzZUNhdGVnb3JpZXMuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5pZCA9PT0gaWQpO1xyXG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGNvZGU6IDEsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnXHU4QkZFXHU3QTBCXHU3QzdCXHU1MjJCXHU0RTBEXHU1QjU4XHU1NzI4JyxcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTY4QzBcdTY3RTVcdTRFRTNcdTc4MDFcdTY2MkZcdTU0MjZcdTVERjJcdTg4QUJcdTUxNzZcdTRFRDZcdThCQjBcdTVGNTVcdTRGN0ZcdTc1MjhcclxuICAgICAgY29uc3QgZHVwbGljYXRlQ29kZSA9IGNvdXJzZUNhdGVnb3JpZXMuZmluZChpdGVtID0+IGl0ZW0uY29kZSA9PT0gY29kZSAmJiBpdGVtLmlkICE9PSBpZCk7XHJcbiAgICAgIGlmIChkdXBsaWNhdGVDb2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGNvZGU6IDEsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnXHU4QkZFXHU3QTBCXHU3QzdCXHU1MjJCXHU0RUUzXHU3ODAxXHU1REYyXHU1QjU4XHU1NzI4JyxcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTY2RjRcdTY1QjBcclxuICAgICAgY291cnNlQ2F0ZWdvcmllc1tpbmRleF0gPSB7XHJcbiAgICAgICAgLi4uY291cnNlQ2F0ZWdvcmllc1tpbmRleF0sXHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICBjb2RlLFxyXG4gICAgICAgIHN0YXR1czogdHlwZW9mIHN0YXR1cyA9PT0gJ251bWJlcicgPyBzdGF0dXMgOiBjb3Vyc2VDYXRlZ29yaWVzW2luZGV4XS5zdGF0dXMsXHJcbiAgICAgICAgc29ydDogdHlwZW9mIHNvcnQgPT09ICdudW1iZXInID8gc29ydCA6IGNvdXJzZUNhdGVnb3JpZXNbaW5kZXhdLnNvcnQsXHJcbiAgICAgICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSksXHJcbiAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgZGF0YTogY291cnNlQ2F0ZWdvcmllc1tpbmRleF0sXHJcbiAgICAgICAgbWVzc2FnZTogJ1x1NjZGNFx1NjVCMFx1NjIxMFx1NTI5RicsXHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgXHJcbiAgLy8gXHU1MjIwXHU5NjY0XHU4QkZFXHU3QTBCXHU3QzdCXHU1MjJCXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UvY2F0ZWdvcnkvZGVsZXRlLzppZCcsXHJcbiAgICBtZXRob2Q6ICdkZWxldGUnLFxyXG4gICAgcmVzcG9uc2U6ICh7IHBhcmFtcyB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IGlkID0gcGFyc2VJbnQocGFyYW1zLmlkLCAxMCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTY3RTVcdTYyN0VcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcclxuICAgICAgY29uc3QgaW5kZXggPSBjb3Vyc2VDYXRlZ29yaWVzLmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IGlkKTtcclxuICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBjb2RlOiAxLFxyXG4gICAgICAgICAgbWVzc2FnZTogJ1x1OEJGRVx1N0EwQlx1N0M3Qlx1NTIyQlx1NEUwRFx1NUI1OFx1NTcyOCcsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gXHU1MjIwXHU5NjY0XHJcbiAgICAgIGNvdXJzZUNhdGVnb3JpZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBtZXNzYWdlOiAnXHU1MjIwXHU5NjY0XHU2MjEwXHU1MjlGJyxcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBcclxuICAvLyBcdTU0MENcdTZCNjVcdThCRkVcdTdBMEJcdTdDN0JcdTUyMkJcclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS9jYXRlZ29yeS9zeW5jJyxcclxuICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBjb2RlOiAwLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdcdTU0MENcdTZCNjVcdTYyMTBcdTUyOUYnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIGFkZGVkOiAzLFxyXG4gICAgICAgICAgdXBkYXRlZDogMixcclxuICAgICAgICAgIGZhaWxlZDogMCxcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgXHJcbiAgLy8gXHU4M0I3XHU1M0Q2XHU4MDAzXHU4QkQ1XHU1RjYyXHU1RjBGXHU1MjE3XHU4ODY4XHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UvZXhhbS10eXBlL2xpc3QnLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBxdWVyeSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgcGFnZVNpemUgPSAxMCwgcGFnZUluZGV4ID0gMSwgbmFtZSA9ICcnLCBjb2RlID0gJycsIHN0YXR1cyA9ICcnIH0gPSBxdWVyeTtcclxuICAgICAgXHJcbiAgICAgIGxldCBmaWx0ZXJlZExpc3QgPSBbLi4uZXhhbVR5cGVzXTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1N0I1Qlx1OTAwOVxyXG4gICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgIGZpbHRlcmVkTGlzdCA9IGZpbHRlcmVkTGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLm5hbWUuaW5jbHVkZXMobmFtZSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjb2RlKSB7XHJcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uY29kZS5pbmNsdWRlcyhjb2RlKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHN0YXR1cyAhPT0gJycpIHtcclxuICAgICAgICBmaWx0ZXJlZExpc3QgPSBmaWx0ZXJlZExpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5zdGF0dXMgPT09IHBhcnNlSW50KHN0YXR1cywgMTApKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gXHU1MjA2XHU5ODc1XHJcbiAgICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2VJbmRleCAtIDEpICogcGFnZVNpemU7XHJcbiAgICAgIGNvbnN0IGVuZCA9IHBhZ2VJbmRleCAqIHBhZ2VTaXplO1xyXG4gICAgICBjb25zdCBsaXN0ID0gZmlsdGVyZWRMaXN0LnNsaWNlKHN0YXJ0LCBlbmQpO1xyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBjb2RlOiAwLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIGxpc3QsXHJcbiAgICAgICAgICB0b3RhbDogZmlsdGVyZWRMaXN0Lmxlbmd0aCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2U6ICdvaycsXHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgXHJcbiAgLy8gXHU2REZCXHU1MkEwXHU4MDAzXHU4QkQ1XHU1RjYyXHU1RjBGXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UvZXhhbS10eXBlL2FkZCcsXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH0pID0+IHtcclxuICAgICAgY29uc3QgeyBuYW1lLCBjb2RlIH0gPSBib2R5O1xyXG4gICAgICBcclxuICAgICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4XHJcbiAgICAgIGNvbnN0IGV4aXN0aW5nSXRlbSA9IGV4YW1UeXBlcy5maW5kKGl0ZW0gPT4gaXRlbS5jb2RlID09PSBjb2RlKTtcclxuICAgICAgaWYgKGV4aXN0aW5nSXRlbSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBjb2RlOiAxLFxyXG4gICAgICAgICAgbWVzc2FnZTogJ1x1ODAwM1x1OEJENVx1NUY2Mlx1NUYwRlx1NEVFM1x1NzgwMVx1NURGMlx1NUI1OFx1NTcyOCcsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gXHU2NUIwXHU1ODlFXHJcbiAgICAgIGNvbnN0IG5ld0lkID0gZXhhbVR5cGVzLmxlbmd0aCA+IDAgPyBNYXRoLm1heCguLi5leGFtVHlwZXMubWFwKGl0ZW0gPT4gaXRlbS5pZCkpICsgMSA6IDE7XHJcbiAgICAgIGNvbnN0IG5ld0l0ZW0gPSB7XHJcbiAgICAgICAgaWQ6IG5ld0lkLFxyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgY29kZSxcclxuICAgICAgICBzdGF0dXM6IDEsXHJcbiAgICAgICAgc29ydDogZXhhbVR5cGVzLmxlbmd0aCArIDEsXHJcbiAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSksXHJcbiAgICAgICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSksXHJcbiAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICBleGFtVHlwZXMucHVzaChuZXdJdGVtKTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBkYXRhOiBuZXdJdGVtLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdcdTZERkJcdTUyQTBcdTYyMTBcdTUyOUYnLFxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG4gIFxyXG4gIC8vIFx1NEZFRVx1NjUzOVx1ODAwM1x1OEJENVx1NUY2Mlx1NUYwRlxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY291cnNlL2V4YW0tdHlwZS91cGRhdGUnLFxyXG4gICAgbWV0aG9kOiAncHV0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH0pID0+IHtcclxuICAgICAgY29uc3QgeyBpZCwgbmFtZSwgY29kZSwgc3RhdHVzLCBzb3J0IH0gPSBib2R5O1xyXG4gICAgICBcclxuICAgICAgLy8gXHU2N0U1XHU2MjdFXHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gZXhhbVR5cGVzLmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IGlkKTtcclxuICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBjb2RlOiAxLFxyXG4gICAgICAgICAgbWVzc2FnZTogJ1x1ODAwM1x1OEJENVx1NUY2Mlx1NUYwRlx1NEUwRFx1NUI1OFx1NTcyOCcsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gXHU2OEMwXHU2N0U1XHU0RUUzXHU3ODAxXHU2NjJGXHU1NDI2XHU1REYyXHU4OEFCXHU1MTc2XHU0RUQ2XHU4QkIwXHU1RjU1XHU0RjdGXHU3NTI4XHJcbiAgICAgIGNvbnN0IGR1cGxpY2F0ZUNvZGUgPSBleGFtVHlwZXMuZmluZChpdGVtID0+IGl0ZW0uY29kZSA9PT0gY29kZSAmJiBpdGVtLmlkICE9PSBpZCk7XHJcbiAgICAgIGlmIChkdXBsaWNhdGVDb2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGNvZGU6IDEsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnXHU4MDAzXHU4QkQ1XHU1RjYyXHU1RjBGXHU0RUUzXHU3ODAxXHU1REYyXHU1QjU4XHU1NzI4JyxcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTY2RjRcdTY1QjBcclxuICAgICAgZXhhbVR5cGVzW2luZGV4XSA9IHtcclxuICAgICAgICAuLi5leGFtVHlwZXNbaW5kZXhdLFxyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgY29kZSxcclxuICAgICAgICBzdGF0dXM6IHR5cGVvZiBzdGF0dXMgPT09ICdudW1iZXInID8gc3RhdHVzIDogZXhhbVR5cGVzW2luZGV4XS5zdGF0dXMsXHJcbiAgICAgICAgc29ydDogdHlwZW9mIHNvcnQgPT09ICdudW1iZXInID8gc29ydCA6IGV4YW1UeXBlc1tpbmRleF0uc29ydCxcclxuICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnVCcsICcgJykuc3Vic3RyaW5nKDAsIDE5KSxcclxuICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBkYXRhOiBleGFtVHlwZXNbaW5kZXhdLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY2RjRcdTY1QjBcdTYyMTBcdTUyOUYnLFxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG4gIFxyXG4gIC8vIFx1NTIyMFx1OTY2NFx1ODAwM1x1OEJENVx1NUY2Mlx1NUYwRlxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY291cnNlL2V4YW0tdHlwZS9kZWxldGUvOmlkJyxcclxuICAgIG1ldGhvZDogJ2RlbGV0ZScsXHJcbiAgICByZXNwb25zZTogKHsgcGFyYW1zIH0pID0+IHtcclxuICAgICAgY29uc3QgaWQgPSBwYXJzZUludChwYXJhbXMuaWQsIDEwKTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NjdFNVx1NjI3RVx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxyXG4gICAgICBjb25zdCBpbmRleCA9IGV4YW1UeXBlcy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLmlkID09PSBpZCk7XHJcbiAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgY29kZTogMSxcclxuICAgICAgICAgIG1lc3NhZ2U6ICdcdTgwMDNcdThCRDVcdTVGNjJcdTVGMEZcdTRFMERcdTVCNThcdTU3MjgnLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFx1NTIyMFx1OTY2NFxyXG4gICAgICBleGFtVHlwZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBtZXNzYWdlOiAnXHU1MjIwXHU5NjY0XHU2MjEwXHU1MjlGJyxcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBcclxuICAvLyBcdTU0MENcdTZCNjVcdTgwMDNcdThCRDVcdTVGNjJcdTVGMEZcclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS9leGFtLXR5cGUvc3luYycsXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBtZXNzYWdlOiAnXHU1NDBDXHU2QjY1XHU2MjEwXHU1MjlGJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBhZGRlZDogMSxcclxuICAgICAgICAgIHVwZGF0ZWQ6IDMsXHJcbiAgICAgICAgICBmYWlsZWQ6IDAsXHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG5dIGFzIE1vY2tNZXRob2RbXTsgIl0sCiAgIm1hcHBpbmdzIjogIjtBQUdBLElBQU0sZ0JBQWdCO0VBQ3BCLEVBQUUsSUFBSSxHQUFHLE1BQU0sTUFBTSxNQUFNLGdCQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsWUFBWSx1QkFBdUIsWUFBWSxzQkFBc0I7RUFDMUgsRUFBRSxJQUFJLEdBQUcsTUFBTSxNQUFNLE1BQU0sZ0JBQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxZQUFZLHVCQUF1QixZQUFZLHNCQUFzQjtFQUMxSCxFQUFFLElBQUksR0FBRyxNQUFNLE1BQU0sTUFBTSxnQkFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLFlBQVksdUJBQXVCLFlBQVksc0JBQXNCO0VBQzFILEVBQUUsSUFBSSxHQUFHLE1BQU0sTUFBTSxNQUFNLGdCQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsWUFBWSx1QkFBdUIsWUFBWSxzQkFBc0I7RUFDMUgsRUFBRSxJQUFJLEdBQUcsTUFBTSxNQUFNLE1BQU0sZ0JBQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxZQUFZLHVCQUF1QixZQUFZLHNCQUFzQjtBQUM1SDtBQUdBLElBQU0sbUJBQW1CO0VBQ3ZCLEVBQUUsSUFBSSxHQUFHLE1BQU0sTUFBTSxNQUFNLGtDQUFTLFFBQVEsR0FBRyxNQUFNLEdBQUcsWUFBWSx1QkFBdUIsWUFBWSxz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
