// mock/course-metadata.ts
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibW9jay9jb3Vyc2UtbWV0YWRhdGEudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSEMuUlxcXFxEZXNrdG9wXFxcXGNoYXRcXFxcU1JQXFxcXE5TUlBcXFxcUlBcXFxcbW9ja1xcXFxjb3Vyc2UtbWV0YWRhdGEudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSEMuUlxcXFxEZXNrdG9wXFxcXGNoYXRcXFxcU1JQXFxcXE5TUlBcXFxcUlBcXFxcbW9ja1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vQzovVXNlcnMvSEMuUi9EZXNrdG9wL2NoYXQvU1JQL05TUlAvUlAvbW9jay9jb3Vyc2UtbWV0YWRhdGEudHNcIjtpbXBvcnQgeyBNb2NrTWV0aG9kIH0gZnJvbSAndml0ZS1wbHVnaW4tbW9jayc7XHJcblxyXG4vLyBcdThCRkVcdTdBMEJcdTYwMjdcdThEMjhcdTUyMTdcdTg4NjhcclxuY29uc3QgY291cnNlTmF0dXJlcyA9IFtcclxuICB7IGlkOiAxLCBjb2RlOiAnQlgnLCBuYW1lOiAnXHU1RkM1XHU0RkVFJywgc3RhdHVzOiAxLCBzb3J0OiAxLCBjcmVhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcsIHVwZGF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJyB9LFxyXG4gIHsgaWQ6IDIsIGNvZGU6ICdYWCcsIG5hbWU6ICdcdTkwMDlcdTRGRUUnLCBzdGF0dXM6IDEsIHNvcnQ6IDIsIGNyZWF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJywgdXBkYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnIH0sXHJcbiAgeyBpZDogMywgY29kZTogJ1hCJywgbmFtZTogJ1x1OTY1MFx1NUZDNScsIHN0YXR1czogMSwgc29ydDogMywgY3JlYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnLCB1cGRhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcgfSxcclxuICB7IGlkOiA0LCBjb2RlOiAnVFgnLCBuYW1lOiAnXHU5MDFBXHU5MDA5Jywgc3RhdHVzOiAxLCBzb3J0OiA0LCBjcmVhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcsIHVwZGF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJyB9LFxyXG4gIHsgaWQ6IDUsIGNvZGU6ICdaWCcsIG5hbWU6ICdcdTRFMTNcdTkwMDknLCBzdGF0dXM6IDAsIHNvcnQ6IDUsIGNyZWF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJywgdXBkYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnIH1cclxuXTtcclxuXHJcbi8vIFx1OEJGRVx1N0EwQlx1N0M3Qlx1NTIyQlx1NTIxN1x1ODg2OFxyXG5jb25zdCBjb3Vyc2VDYXRlZ29yaWVzID0gW1xyXG4gIHsgaWQ6IDEsIGNvZGU6ICdHQycsIG5hbWU6ICdcdTUxNkNcdTUxNzFcdTU3RkFcdTc4NDBcdThCRkUnLCBzdGF0dXM6IDEsIHNvcnQ6IDEsIGNyZWF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJywgdXBkYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnIH0sXHJcbiAgeyBpZDogMiwgY29kZTogJ1pKJywgbmFtZTogJ1x1NEUxM1x1NEUxQVx1NTdGQVx1Nzg0MFx1OEJGRScsIHN0YXR1czogMSwgc29ydDogMiwgY3JlYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnLCB1cGRhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcgfSxcclxuICB7IGlkOiAzLCBjb2RlOiAnWlknLCBuYW1lOiAnXHU0RTEzXHU0RTFBXHU4QkZFJywgc3RhdHVzOiAxLCBzb3J0OiAzLCBjcmVhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcsIHVwZGF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJyB9LFxyXG4gIHsgaWQ6IDQsIGNvZGU6ICdTSicsIG5hbWU6ICdcdTVCOUVcdThERjVcdTY1NTlcdTVCNjYnLCBzdGF0dXM6IDEsIHNvcnQ6IDQsIGNyZWF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJywgdXBkYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnIH0sXHJcbiAgeyBpZDogNSwgY29kZTogJ1RYJywgbmFtZTogJ1x1OTAxQVx1OEJDNlx1OTAwOVx1NEZFRVx1OEJGRScsIHN0YXR1czogMSwgc29ydDogNSwgY3JlYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnLCB1cGRhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcgfSxcclxuICB7IGlkOiA2LCBjb2RlOiAnSlgnLCBuYW1lOiAnXHU5NkM2XHU0RTJEXHU1QjlFXHU4REY1Jywgc3RhdHVzOiAwLCBzb3J0OiA2LCBjcmVhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcsIHVwZGF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJyB9XHJcbl07XHJcblxyXG4vLyBcdTgwMDNcdThCRDVcdTVGNjJcdTVGMEZcdTUyMTdcdTg4NjhcclxuY29uc3QgZXhhbVR5cGVzID0gW1xyXG4gIHsgaWQ6IDEsIGNvZGU6ICdLUycsIG5hbWU6ICdcdTgwMDNcdThCRDUnLCBzdGF0dXM6IDEsIHNvcnQ6IDEsIGNyZWF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJywgdXBkYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnIH0sXHJcbiAgeyBpZDogMiwgY29kZTogJ0tDJywgbmFtZTogJ1x1ODAwM1x1NjdFNScsIHN0YXR1czogMSwgc29ydDogMiwgY3JlYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnLCB1cGRhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcgfSxcclxuICB7IGlkOiAzLCBjb2RlOiAnTFcnLCBuYW1lOiAnXHU4QkJBXHU2NTg3Jywgc3RhdHVzOiAxLCBzb3J0OiAzLCBjcmVhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcsIHVwZGF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJyB9LFxyXG4gIHsgaWQ6IDQsIGNvZGU6ICdTSicsIG5hbWU6ICdcdThCQkVcdThCQTEnLCBzdGF0dXM6IDEsIHNvcnQ6IDQsIGNyZWF0ZVRpbWU6ICcyMDIzLTAxLTAxIDAwOjAwOjAwJywgdXBkYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnIH0sXHJcbiAgeyBpZDogNSwgY29kZTogJ0NaJywgbmFtZTogJ1x1NjRDRFx1NEY1QycsIHN0YXR1czogMCwgc29ydDogNSwgY3JlYXRlVGltZTogJzIwMjMtMDEtMDEgMDA6MDA6MDAnLCB1cGRhdGVUaW1lOiAnMjAyMy0wMS0wMSAwMDowMDowMCcgfVxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgW1xyXG4gIC8vIFx1ODNCN1x1NTNENlx1OEJGRVx1N0EwQlx1NjAyN1x1OEQyOFx1NTIxN1x1ODg2OFxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY291cnNlL25hdHVyZS9saXN0JyxcclxuICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICByZXNwb25zZTogKHsgcXVlcnkgfSkgPT4ge1xyXG4gICAgICBjb25zdCB7IHBhZ2VTaXplID0gMTAsIHBhZ2VJbmRleCA9IDEsIG5hbWUgPSAnJywgY29kZSA9ICcnLCBzdGF0dXMgPSAnJyB9ID0gcXVlcnk7XHJcbiAgICAgIFxyXG4gICAgICBsZXQgZmlsdGVyZWRMaXN0ID0gWy4uLmNvdXJzZU5hdHVyZXNdO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU3QjVCXHU5MDA5XHJcbiAgICAgIGlmIChuYW1lKSB7XHJcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0ubmFtZS5pbmNsdWRlcyhuYW1lKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNvZGUpIHtcclxuICAgICAgICBmaWx0ZXJlZExpc3QgPSBmaWx0ZXJlZExpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5jb2RlLmluY2x1ZGVzKGNvZGUpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoc3RhdHVzICE9PSAnJykge1xyXG4gICAgICAgIGZpbHRlcmVkTGlzdCA9IGZpbHRlcmVkTGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLnN0YXR1cyA9PT0gcGFyc2VJbnQoc3RhdHVzLCAxMCkpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTUyMDZcdTk4NzVcclxuICAgICAgY29uc3Qgc3RhcnQgPSAocGFnZUluZGV4IC0gMSkgKiBwYWdlU2l6ZTtcclxuICAgICAgY29uc3QgZW5kID0gcGFnZUluZGV4ICogcGFnZVNpemU7XHJcbiAgICAgIGNvbnN0IGxpc3QgPSBmaWx0ZXJlZExpc3Quc2xpY2Uoc3RhcnQsIGVuZCk7XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgbGlzdCxcclxuICAgICAgICAgIHRvdGFsOiBmaWx0ZXJlZExpc3QubGVuZ3RoLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZTogJ29rJyxcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBcclxuICAvLyBcdTZERkJcdTUyQTBcdThCRkVcdTdBMEJcdTYwMjdcdThEMjhcclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS9uYXR1cmUvYWRkJyxcclxuICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgcmVzcG9uc2U6ICh7IGJvZHkgfSkgPT4ge1xyXG4gICAgICBjb25zdCB7IG5hbWUsIGNvZGUgfSA9IGJvZHk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTY4QzBcdTY3RTVcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcclxuICAgICAgY29uc3QgZXhpc3RpbmdJdGVtID0gY291cnNlTmF0dXJlcy5maW5kKGl0ZW0gPT4gaXRlbS5jb2RlID09PSBjb2RlKTtcclxuICAgICAgaWYgKGV4aXN0aW5nSXRlbSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBjb2RlOiAxLFxyXG4gICAgICAgICAgbWVzc2FnZTogJ1x1OEJGRVx1N0EwQlx1NjAyN1x1OEQyOFx1NEVFM1x1NzgwMVx1NURGMlx1NUI1OFx1NTcyOCcsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gXHU2NUIwXHU1ODlFXHJcbiAgICAgIGNvbnN0IG5ld0lkID0gY291cnNlTmF0dXJlcy5sZW5ndGggPiAwID8gTWF0aC5tYXgoLi4uY291cnNlTmF0dXJlcy5tYXAoaXRlbSA9PiBpdGVtLmlkKSkgKyAxIDogMTtcclxuICAgICAgY29uc3QgbmV3SXRlbSA9IHtcclxuICAgICAgICBpZDogbmV3SWQsXHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICBjb2RlLFxyXG4gICAgICAgIHN0YXR1czogMSxcclxuICAgICAgICBzb3J0OiBjb3Vyc2VOYXR1cmVzLmxlbmd0aCArIDEsXHJcbiAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSksXHJcbiAgICAgICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSksXHJcbiAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICBjb3Vyc2VOYXR1cmVzLnB1c2gobmV3SXRlbSk7XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgZGF0YTogbmV3SXRlbSxcclxuICAgICAgICBtZXNzYWdlOiAnXHU2REZCXHU1MkEwXHU2MjEwXHU1MjlGJyxcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBcclxuICAvLyBcdTRGRUVcdTY1MzlcdThCRkVcdTdBMEJcdTYwMjdcdThEMjhcclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS9uYXR1cmUvdXBkYXRlJyxcclxuICAgIG1ldGhvZDogJ3B1dCcsXHJcbiAgICByZXNwb25zZTogKHsgYm9keSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgaWQsIG5hbWUsIGNvZGUsIHN0YXR1cywgc29ydCB9ID0gYm9keTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NjdFNVx1NjI3RVx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxyXG4gICAgICBjb25zdCBpbmRleCA9IGNvdXJzZU5hdHVyZXMuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5pZCA9PT0gaWQpO1xyXG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGNvZGU6IDEsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnXHU4QkZFXHU3QTBCXHU2MDI3XHU4RDI4XHU0RTBEXHU1QjU4XHU1NzI4JyxcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTY4QzBcdTY3RTVcdTRFRTNcdTc4MDFcdTY2MkZcdTU0MjZcdTVERjJcdTg4QUJcdTUxNzZcdTRFRDZcdThCQjBcdTVGNTVcdTRGN0ZcdTc1MjhcclxuICAgICAgY29uc3QgZHVwbGljYXRlQ29kZSA9IGNvdXJzZU5hdHVyZXMuZmluZChpdGVtID0+IGl0ZW0uY29kZSA9PT0gY29kZSAmJiBpdGVtLmlkICE9PSBpZCk7XHJcbiAgICAgIGlmIChkdXBsaWNhdGVDb2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGNvZGU6IDEsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnXHU4QkZFXHU3QTBCXHU2MDI3XHU4RDI4XHU0RUUzXHU3ODAxXHU1REYyXHU1QjU4XHU1NzI4JyxcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTY2RjRcdTY1QjBcclxuICAgICAgY291cnNlTmF0dXJlc1tpbmRleF0gPSB7XHJcbiAgICAgICAgLi4uY291cnNlTmF0dXJlc1tpbmRleF0sXHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICBjb2RlLFxyXG4gICAgICAgIHN0YXR1czogdHlwZW9mIHN0YXR1cyA9PT0gJ251bWJlcicgPyBzdGF0dXMgOiBjb3Vyc2VOYXR1cmVzW2luZGV4XS5zdGF0dXMsXHJcbiAgICAgICAgc29ydDogdHlwZW9mIHNvcnQgPT09ICdudW1iZXInID8gc29ydCA6IGNvdXJzZU5hdHVyZXNbaW5kZXhdLnNvcnQsXHJcbiAgICAgICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSksXHJcbiAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgZGF0YTogY291cnNlTmF0dXJlc1tpbmRleF0sXHJcbiAgICAgICAgbWVzc2FnZTogJ1x1NjZGNFx1NjVCMFx1NjIxMFx1NTI5RicsXHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgXHJcbiAgLy8gXHU1MjIwXHU5NjY0XHU4QkZFXHU3QTBCXHU2MDI3XHU4RDI4XHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UvbmF0dXJlL2RlbGV0ZS86aWQnLFxyXG4gICAgbWV0aG9kOiAnZGVsZXRlJyxcclxuICAgIHJlc3BvbnNlOiAoeyBwYXJhbXMgfSkgPT4ge1xyXG4gICAgICBjb25zdCBpZCA9IHBhcnNlSW50KHBhcmFtcy5pZCwgMTApO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU2N0U1XHU2MjdFXHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gY291cnNlTmF0dXJlcy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLmlkID09PSBpZCk7XHJcbiAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgY29kZTogMSxcclxuICAgICAgICAgIG1lc3NhZ2U6ICdcdThCRkVcdTdBMEJcdTYwMjdcdThEMjhcdTRFMERcdTVCNThcdTU3MjgnLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFx1NTIyMFx1OTY2NFxyXG4gICAgICBjb3Vyc2VOYXR1cmVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgbWVzc2FnZTogJ1x1NTIyMFx1OTY2NFx1NjIxMFx1NTI5RicsXHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgXHJcbiAgLy8gXHU1NDBDXHU2QjY1XHU4QkZFXHU3QTBCXHU2MDI3XHU4RDI4XHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UvbmF0dXJlL3N5bmMnLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKCkgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgbWVzc2FnZTogJ1x1NTQwQ1x1NkI2NVx1NjIxMFx1NTI5RicsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgYWRkZWQ6IDIsXHJcbiAgICAgICAgICB1cGRhdGVkOiAxLFxyXG4gICAgICAgICAgZmFpbGVkOiAwLFxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBcclxuICAvLyBcdTgzQjdcdTUzRDZcdThCRkVcdTdBMEJcdTdDN0JcdTUyMkJcdTUyMTdcdTg4NjhcclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS9jYXRlZ29yeS9saXN0JyxcclxuICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICByZXNwb25zZTogKHsgcXVlcnkgfSkgPT4ge1xyXG4gICAgICBjb25zdCB7IHBhZ2VTaXplID0gMTAsIHBhZ2VJbmRleCA9IDEsIG5hbWUgPSAnJywgY29kZSA9ICcnLCBzdGF0dXMgPSAnJyB9ID0gcXVlcnk7XHJcbiAgICAgIFxyXG4gICAgICBsZXQgZmlsdGVyZWRMaXN0ID0gWy4uLmNvdXJzZUNhdGVnb3JpZXNdO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU3QjVCXHU5MDA5XHJcbiAgICAgIGlmIChuYW1lKSB7XHJcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0ubmFtZS5pbmNsdWRlcyhuYW1lKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNvZGUpIHtcclxuICAgICAgICBmaWx0ZXJlZExpc3QgPSBmaWx0ZXJlZExpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5jb2RlLmluY2x1ZGVzKGNvZGUpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoc3RhdHVzICE9PSAnJykge1xyXG4gICAgICAgIGZpbHRlcmVkTGlzdCA9IGZpbHRlcmVkTGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLnN0YXR1cyA9PT0gcGFyc2VJbnQoc3RhdHVzLCAxMCkpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTUyMDZcdTk4NzVcclxuICAgICAgY29uc3Qgc3RhcnQgPSAocGFnZUluZGV4IC0gMSkgKiBwYWdlU2l6ZTtcclxuICAgICAgY29uc3QgZW5kID0gcGFnZUluZGV4ICogcGFnZVNpemU7XHJcbiAgICAgIGNvbnN0IGxpc3QgPSBmaWx0ZXJlZExpc3Quc2xpY2Uoc3RhcnQsIGVuZCk7XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgbGlzdCxcclxuICAgICAgICAgIHRvdGFsOiBmaWx0ZXJlZExpc3QubGVuZ3RoLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZTogJ29rJyxcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBcclxuICAvLyBcdTZERkJcdTUyQTBcdThCRkVcdTdBMEJcdTdDN0JcdTUyMkJcclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS9jYXRlZ29yeS9hZGQnLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKHsgYm9keSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgbmFtZSwgY29kZSB9ID0gYm9keTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxyXG4gICAgICBjb25zdCBleGlzdGluZ0l0ZW0gPSBjb3Vyc2VDYXRlZ29yaWVzLmZpbmQoaXRlbSA9PiBpdGVtLmNvZGUgPT09IGNvZGUpO1xyXG4gICAgICBpZiAoZXhpc3RpbmdJdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGNvZGU6IDEsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnXHU4QkZFXHU3QTBCXHU3QzdCXHU1MjJCXHU0RUUzXHU3ODAxXHU1REYyXHU1QjU4XHU1NzI4JyxcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTY1QjBcdTU4OUVcclxuICAgICAgY29uc3QgbmV3SWQgPSBjb3Vyc2VDYXRlZ29yaWVzLmxlbmd0aCA+IDAgPyBNYXRoLm1heCguLi5jb3Vyc2VDYXRlZ29yaWVzLm1hcChpdGVtID0+IGl0ZW0uaWQpKSArIDEgOiAxO1xyXG4gICAgICBjb25zdCBuZXdJdGVtID0ge1xyXG4gICAgICAgIGlkOiBuZXdJZCxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIGNvZGUsXHJcbiAgICAgICAgc3RhdHVzOiAxLFxyXG4gICAgICAgIHNvcnQ6IGNvdXJzZUNhdGVnb3JpZXMubGVuZ3RoICsgMSxcclxuICAgICAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnVCcsICcgJykuc3Vic3RyaW5nKDAsIDE5KSxcclxuICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnVCcsICcgJykuc3Vic3RyaW5nKDAsIDE5KSxcclxuICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgIGNvdXJzZUNhdGVnb3JpZXMucHVzaChuZXdJdGVtKTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBkYXRhOiBuZXdJdGVtLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdcdTZERkJcdTUyQTBcdTYyMTBcdTUyOUYnLFxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG4gIFxyXG4gIC8vIFx1NEZFRVx1NjUzOVx1OEJGRVx1N0EwQlx1N0M3Qlx1NTIyQlxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY291cnNlL2NhdGVnb3J5L3VwZGF0ZScsXHJcbiAgICBtZXRob2Q6ICdwdXQnLFxyXG4gICAgcmVzcG9uc2U6ICh7IGJvZHkgfSkgPT4ge1xyXG4gICAgICBjb25zdCB7IGlkLCBuYW1lLCBjb2RlLCBzdGF0dXMsIHNvcnQgfSA9IGJvZHk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTY3RTVcdTYyN0VcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcclxuICAgICAgY29uc3QgaW5kZXggPSBjb3Vyc2VDYXRlZ29yaWVzLmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IGlkKTtcclxuICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBjb2RlOiAxLFxyXG4gICAgICAgICAgbWVzc2FnZTogJ1x1OEJGRVx1N0EwQlx1N0M3Qlx1NTIyQlx1NEUwRFx1NUI1OFx1NTcyOCcsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gXHU2OEMwXHU2N0U1XHU0RUUzXHU3ODAxXHU2NjJGXHU1NDI2XHU1REYyXHU4OEFCXHU1MTc2XHU0RUQ2XHU4QkIwXHU1RjU1XHU0RjdGXHU3NTI4XHJcbiAgICAgIGNvbnN0IGR1cGxpY2F0ZUNvZGUgPSBjb3Vyc2VDYXRlZ29yaWVzLmZpbmQoaXRlbSA9PiBpdGVtLmNvZGUgPT09IGNvZGUgJiYgaXRlbS5pZCAhPT0gaWQpO1xyXG4gICAgICBpZiAoZHVwbGljYXRlQ29kZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBjb2RlOiAxLFxyXG4gICAgICAgICAgbWVzc2FnZTogJ1x1OEJGRVx1N0EwQlx1N0M3Qlx1NTIyQlx1NEVFM1x1NzgwMVx1NURGMlx1NUI1OFx1NTcyOCcsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gXHU2NkY0XHU2NUIwXHJcbiAgICAgIGNvdXJzZUNhdGVnb3JpZXNbaW5kZXhdID0ge1xyXG4gICAgICAgIC4uLmNvdXJzZUNhdGVnb3JpZXNbaW5kZXhdLFxyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgY29kZSxcclxuICAgICAgICBzdGF0dXM6IHR5cGVvZiBzdGF0dXMgPT09ICdudW1iZXInID8gc3RhdHVzIDogY291cnNlQ2F0ZWdvcmllc1tpbmRleF0uc3RhdHVzLFxyXG4gICAgICAgIHNvcnQ6IHR5cGVvZiBzb3J0ID09PSAnbnVtYmVyJyA/IHNvcnQgOiBjb3Vyc2VDYXRlZ29yaWVzW2luZGV4XS5zb3J0LFxyXG4gICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKCdUJywgJyAnKS5zdWJzdHJpbmcoMCwgMTkpLFxyXG4gICAgICB9O1xyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBjb2RlOiAwLFxyXG4gICAgICAgIGRhdGE6IGNvdXJzZUNhdGVnb3JpZXNbaW5kZXhdLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdcdTY2RjRcdTY1QjBcdTYyMTBcdTUyOUYnLFxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG4gIFxyXG4gIC8vIFx1NTIyMFx1OTY2NFx1OEJGRVx1N0EwQlx1N0M3Qlx1NTIyQlxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY291cnNlL2NhdGVnb3J5L2RlbGV0ZS86aWQnLFxyXG4gICAgbWV0aG9kOiAnZGVsZXRlJyxcclxuICAgIHJlc3BvbnNlOiAoeyBwYXJhbXMgfSkgPT4ge1xyXG4gICAgICBjb25zdCBpZCA9IHBhcnNlSW50KHBhcmFtcy5pZCwgMTApO1xyXG4gICAgICBcclxuICAgICAgLy8gXHU2N0U1XHU2MjdFXHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gY291cnNlQ2F0ZWdvcmllcy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLmlkID09PSBpZCk7XHJcbiAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgY29kZTogMSxcclxuICAgICAgICAgIG1lc3NhZ2U6ICdcdThCRkVcdTdBMEJcdTdDN0JcdTUyMkJcdTRFMERcdTVCNThcdTU3MjgnLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFx1NTIyMFx1OTY2NFxyXG4gICAgICBjb3Vyc2VDYXRlZ29yaWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgbWVzc2FnZTogJ1x1NTIyMFx1OTY2NFx1NjIxMFx1NTI5RicsXHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgXHJcbiAgLy8gXHU1NDBDXHU2QjY1XHU4QkZFXHU3QTBCXHU3QzdCXHU1MjJCXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UvY2F0ZWdvcnkvc3luYycsXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBtZXNzYWdlOiAnXHU1NDBDXHU2QjY1XHU2MjEwXHU1MjlGJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBhZGRlZDogMyxcclxuICAgICAgICAgIHVwZGF0ZWQ6IDIsXHJcbiAgICAgICAgICBmYWlsZWQ6IDAsXHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG4gIFxyXG4gIC8vIFx1ODNCN1x1NTNENlx1ODAwM1x1OEJENVx1NUY2Mlx1NUYwRlx1NTIxN1x1ODg2OFxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY291cnNlL2V4YW0tdHlwZS9saXN0JyxcclxuICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICByZXNwb25zZTogKHsgcXVlcnkgfSkgPT4ge1xyXG4gICAgICBjb25zdCB7IHBhZ2VTaXplID0gMTAsIHBhZ2VJbmRleCA9IDEsIG5hbWUgPSAnJywgY29kZSA9ICcnLCBzdGF0dXMgPSAnJyB9ID0gcXVlcnk7XHJcbiAgICAgIFxyXG4gICAgICBsZXQgZmlsdGVyZWRMaXN0ID0gWy4uLmV4YW1UeXBlc107XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTdCNUJcdTkwMDlcclxuICAgICAgaWYgKG5hbWUpIHtcclxuICAgICAgICBmaWx0ZXJlZExpc3QgPSBmaWx0ZXJlZExpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS5uYW1lLmluY2x1ZGVzKG5hbWUpKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY29kZSkge1xyXG4gICAgICAgIGZpbHRlcmVkTGlzdCA9IGZpbHRlcmVkTGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLmNvZGUuaW5jbHVkZXMoY29kZSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChzdGF0dXMgIT09ICcnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uc3RhdHVzID09PSBwYXJzZUludChzdGF0dXMsIDEwKSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFx1NTIwNlx1OTg3NVxyXG4gICAgICBjb25zdCBzdGFydCA9IChwYWdlSW5kZXggLSAxKSAqIHBhZ2VTaXplO1xyXG4gICAgICBjb25zdCBlbmQgPSBwYWdlSW5kZXggKiBwYWdlU2l6ZTtcclxuICAgICAgY29uc3QgbGlzdCA9IGZpbHRlcmVkTGlzdC5zbGljZShzdGFydCwgZW5kKTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBsaXN0LFxyXG4gICAgICAgICAgdG90YWw6IGZpbHRlcmVkTGlzdC5sZW5ndGgsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlOiAnb2snLFxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG4gIFxyXG4gIC8vIFx1NkRGQlx1NTJBMFx1ODAwM1x1OEJENVx1NUY2Mlx1NUYwRlxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY291cnNlL2V4YW0tdHlwZS9hZGQnLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKHsgYm9keSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgbmFtZSwgY29kZSB9ID0gYm9keTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxyXG4gICAgICBjb25zdCBleGlzdGluZ0l0ZW0gPSBleGFtVHlwZXMuZmluZChpdGVtID0+IGl0ZW0uY29kZSA9PT0gY29kZSk7XHJcbiAgICAgIGlmIChleGlzdGluZ0l0ZW0pIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgY29kZTogMSxcclxuICAgICAgICAgIG1lc3NhZ2U6ICdcdTgwMDNcdThCRDVcdTVGNjJcdTVGMEZcdTRFRTNcdTc4MDFcdTVERjJcdTVCNThcdTU3MjgnLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFx1NjVCMFx1NTg5RVxyXG4gICAgICBjb25zdCBuZXdJZCA9IGV4YW1UeXBlcy5sZW5ndGggPiAwID8gTWF0aC5tYXgoLi4uZXhhbVR5cGVzLm1hcChpdGVtID0+IGl0ZW0uaWQpKSArIDEgOiAxO1xyXG4gICAgICBjb25zdCBuZXdJdGVtID0ge1xyXG4gICAgICAgIGlkOiBuZXdJZCxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIGNvZGUsXHJcbiAgICAgICAgc3RhdHVzOiAxLFxyXG4gICAgICAgIHNvcnQ6IGV4YW1UeXBlcy5sZW5ndGggKyAxLFxyXG4gICAgICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKCdUJywgJyAnKS5zdWJzdHJpbmcoMCwgMTkpLFxyXG4gICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKCdUJywgJyAnKS5zdWJzdHJpbmcoMCwgMTkpLFxyXG4gICAgICB9O1xyXG4gICAgICBcclxuICAgICAgZXhhbVR5cGVzLnB1c2gobmV3SXRlbSk7XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgZGF0YTogbmV3SXRlbSxcclxuICAgICAgICBtZXNzYWdlOiAnXHU2REZCXHU1MkEwXHU2MjEwXHU1MjlGJyxcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBcclxuICAvLyBcdTRGRUVcdTY1MzlcdTgwMDNcdThCRDVcdTVGNjJcdTVGMEZcclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS9leGFtLXR5cGUvdXBkYXRlJyxcclxuICAgIG1ldGhvZDogJ3B1dCcsXHJcbiAgICByZXNwb25zZTogKHsgYm9keSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgaWQsIG5hbWUsIGNvZGUsIHN0YXR1cywgc29ydCB9ID0gYm9keTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1NjdFNVx1NjI3RVx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxyXG4gICAgICBjb25zdCBpbmRleCA9IGV4YW1UeXBlcy5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLmlkID09PSBpZCk7XHJcbiAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgY29kZTogMSxcclxuICAgICAgICAgIG1lc3NhZ2U6ICdcdTgwMDNcdThCRDVcdTVGNjJcdTVGMEZcdTRFMERcdTVCNThcdTU3MjgnLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NEVFM1x1NzgwMVx1NjYyRlx1NTQyNlx1NURGMlx1ODhBQlx1NTE3Nlx1NEVENlx1OEJCMFx1NUY1NVx1NEY3Rlx1NzUyOFxyXG4gICAgICBjb25zdCBkdXBsaWNhdGVDb2RlID0gZXhhbVR5cGVzLmZpbmQoaXRlbSA9PiBpdGVtLmNvZGUgPT09IGNvZGUgJiYgaXRlbS5pZCAhPT0gaWQpO1xyXG4gICAgICBpZiAoZHVwbGljYXRlQ29kZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBjb2RlOiAxLFxyXG4gICAgICAgICAgbWVzc2FnZTogJ1x1ODAwM1x1OEJENVx1NUY2Mlx1NUYwRlx1NEVFM1x1NzgwMVx1NURGMlx1NUI1OFx1NTcyOCcsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gXHU2NkY0XHU2NUIwXHJcbiAgICAgIGV4YW1UeXBlc1tpbmRleF0gPSB7XHJcbiAgICAgICAgLi4uZXhhbVR5cGVzW2luZGV4XSxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIGNvZGUsXHJcbiAgICAgICAgc3RhdHVzOiB0eXBlb2Ygc3RhdHVzID09PSAnbnVtYmVyJyA/IHN0YXR1cyA6IGV4YW1UeXBlc1tpbmRleF0uc3RhdHVzLFxyXG4gICAgICAgIHNvcnQ6IHR5cGVvZiBzb3J0ID09PSAnbnVtYmVyJyA/IHNvcnQgOiBleGFtVHlwZXNbaW5kZXhdLnNvcnQsXHJcbiAgICAgICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSksXHJcbiAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgZGF0YTogZXhhbVR5cGVzW2luZGV4XSxcclxuICAgICAgICBtZXNzYWdlOiAnXHU2NkY0XHU2NUIwXHU2MjEwXHU1MjlGJyxcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBcclxuICAvLyBcdTUyMjBcdTk2NjRcdTgwMDNcdThCRDVcdTVGNjJcdTVGMEZcclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS9leGFtLXR5cGUvZGVsZXRlLzppZCcsXHJcbiAgICBtZXRob2Q6ICdkZWxldGUnLFxyXG4gICAgcmVzcG9uc2U6ICh7IHBhcmFtcyB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IGlkID0gcGFyc2VJbnQocGFyYW1zLmlkLCAxMCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTY3RTVcdTYyN0VcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcclxuICAgICAgY29uc3QgaW5kZXggPSBleGFtVHlwZXMuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5pZCA9PT0gaWQpO1xyXG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGNvZGU6IDEsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnXHU4MDAzXHU4QkQ1XHU1RjYyXHU1RjBGXHU0RTBEXHU1QjU4XHU1NzI4JyxcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvLyBcdTUyMjBcdTk2NjRcclxuICAgICAgZXhhbVR5cGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgbWVzc2FnZTogJ1x1NTIyMFx1OTY2NFx1NjIxMFx1NTI5RicsXHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgXHJcbiAgLy8gXHU1NDBDXHU2QjY1XHU4MDAzXHU4QkQ1XHU1RjYyXHU1RjBGXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UvZXhhbS10eXBlL3N5bmMnLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKCkgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgbWVzc2FnZTogJ1x1NTQwQ1x1NkI2NVx1NjIxMFx1NTI5RicsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgYWRkZWQ6IDEsXHJcbiAgICAgICAgICB1cGRhdGVkOiAzLFxyXG4gICAgICAgICAgZmFpbGVkOiAwLFxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgfSxcclxuXSBhcyBNb2NrTWV0aG9kW107ICJdLAogICJtYXBwaW5ncyI6ICI7QUFHQSxJQUFNLGdCQUFnQjtBQUFBLEVBQ3BCLEVBQUUsSUFBSSxHQUFHLE1BQU0sTUFBTSxNQUFNLGdCQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsWUFBWSx1QkFBdUIsWUFBWSxzQkFBc0I7QUFBQSxFQUMxSCxFQUFFLElBQUksR0FBRyxNQUFNLE1BQU0sTUFBTSxnQkFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLFlBQVksdUJBQXVCLFlBQVksc0JBQXNCO0FBQUEsRUFDMUgsRUFBRSxJQUFJLEdBQUcsTUFBTSxNQUFNLE1BQU0sZ0JBQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxZQUFZLHVCQUF1QixZQUFZLHNCQUFzQjtBQUFBLEVBQzFILEVBQUUsSUFBSSxHQUFHLE1BQU0sTUFBTSxNQUFNLGdCQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsWUFBWSx1QkFBdUIsWUFBWSxzQkFBc0I7QUFBQSxFQUMxSCxFQUFFLElBQUksR0FBRyxNQUFNLE1BQU0sTUFBTSxnQkFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLFlBQVksdUJBQXVCLFlBQVksc0JBQXNCO0FBQzVIO0FBR0EsSUFBTSxtQkFBbUI7QUFBQSxFQUN2QixFQUFFLElBQUksR0FBRyxNQUFNLE1BQU0sTUFBTSxrQ0FBUyxRQUFRLEdBQUcsTUFB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
