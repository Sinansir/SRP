// mock/index.ts
import Mock2 from "mockjs";

// mock/course-browse.ts
import Mock from "mockjs";
var courseBrowseList = Array.from({ length: 50 }).map((_, index) => ({
  id: `${index + 1}`,
  code: `C${(1e4 + index).toString()}`,
  name: `\u793A\u4F8B\u8BFE\u7A0B${index + 1}`,
  englishName: `Example Course ${index + 1}`,
  category: ["\u516C\u5171\u57FA\u7840\u8BFE", "\u4E13\u4E1A\u57FA\u7840\u8BFE", "\u4E13\u4E1A\u8BFE", "\u5B9E\u8DF5\u6559\u5B66", "\u901A\u8BC6\u9009\u4FEE\u8BFE"][Math.floor(Math.random() * 5)],
  nature: ["\u5FC5\u4FEE", "\u9009\u4FEE", "\u9650\u9009"][Math.floor(Math.random() * 3)],
  credits: Math.floor(Math.random() * 5) + 1,
  theoryHours: Math.floor(Math.random() * 30) + 10,
  practiceHours: Math.floor(Math.random() * 20),
  totalHours: function() {
    return this.theoryHours + this.practiceHours;
  },
  examType: ["\u8003\u8BD5", "\u8003\u67E5", "\u8BBA\u6587", "\u8BBE\u8BA1", "\u64CD\u4F5C"][Math.floor(Math.random() * 5)],
  department: ["\u8BA1\u7B97\u673A\u5B66\u9662", "\u673A\u68B0\u5B66\u9662", "\u7535\u5B50\u4FE1\u606F\u5B66\u9662", "\u5916\u56FD\u8BED\u5B66\u9662"][Math.floor(Math.random() * 4)],
  isCore: Math.random() > 0.5,
  isBilingual: Math.random() > 0.7,
  description: `\u8FD9\u662F\u4E00\u95E8\u793A\u4F8B\u8BFE\u7A0B\uFF0C\u7528\u4E8E\u5C55\u793A\u8BFE\u7A0B\u4FE1\u606F\u3002`,
  createTime: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss")
}));
var courseBrowseApis = [
  // 获取课程浏览列表
  {
    url: "/api/course/browse",
    method: "get",
    response: ({ query }) => {
      const { pageSize = 10, pageIndex = 1, name = "", code = "", category = "", nature = "", department = "" } = query;
      let filteredList = [...courseBrowseList];
      if (name) {
        filteredList = filteredList.filter((item) => item.name.includes(name));
      }
      if (code) {
        filteredList = filteredList.filter((item) => item.code.includes(code));
      }
      if (category) {
        filteredList = filteredList.filter((item) => item.category === category);
      }
      if (nature) {
        filteredList = filteredList.filter((item) => item.nature === nature);
      }
      if (department) {
        filteredList = filteredList.filter((item) => item.department === department);
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
  // 课程浏览导出
  {
    url: "/api/course/browse/export",
    method: "post",
    response: ({ body }) => {
      return {
        code: 0,
        message: "\u5BFC\u51FA\u6210\u529F",
        data: {
          url: "http://example.com/course-browse.xlsx",
          fileName: "\u8BFE\u7A0B\u6D4F\u89C8\u6570\u636E_" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "") + ".xlsx"
        }
      };
    }
  }
];
var course_browse_default = courseBrowseApis;

// mock/index.ts
var courseMockList = Array.from({ length: 35 }).map((_, index) => ({
  id: `${index + 1}`,
  code: `C${(1e4 + index).toString()}`,
  name: `\u793A\u4F8B\u8BFE\u7A0B${index + 1}`,
  englishName: `Example Course ${index + 1}`,
  category: ["\u516C\u5171\u57FA\u7840\u8BFE", "\u4E13\u4E1A\u57FA\u7840\u8BFE", "\u4E13\u4E1A\u8BFE", "\u5B9E\u8DF5\u6559\u5B66", "\u901A\u8BC6\u9009\u4FEE\u8BFE"][Math.floor(Math.random() * 5)],
  nature: ["\u5FC5\u4FEE", "\u9009\u4FEE", "\u9650\u9009"][Math.floor(Math.random() * 3)],
  credits: Math.floor(Math.random() * 5) + 1,
  theoryHours: Math.floor(Math.random() * 30) + 10,
  practiceHours: Math.floor(Math.random() * 20),
  totalHours: Math.floor(Math.random() * 50) + 20,
  examType: ["\u8003\u8BD5", "\u8003\u67E5", "\u8BBA\u6587", "\u8BBE\u8BA1", "\u64CD\u4F5C"][Math.floor(Math.random() * 5)],
  department: ["\u8BA1\u7B97\u673A\u5B66\u9662", "\u673A\u68B0\u5B66\u9662", "\u7535\u5B50\u4FE1\u606F\u5B66\u9662", "\u5916\u56FD\u8BED\u5B66\u9662"][Math.floor(Math.random() * 4)],
  status: Math.random() > 0.2 ? 1 : 0,
  createTime: Mock2.Random.datetime("yyyy-MM-dd HH:mm:ss")
}));
var courseApis = [
  // 获取课程列表
  {
    url: "/api/course/list",
    method: "get",
    response: ({ query }) => {
      const { pageSize = 10, pageIndex = 1, name = "", code = "", category = "", nature = "", department = "", sort = "", order = "" } = query;
      let filteredList = [...courseMockList];
      if (name) {
        filteredList = filteredList.filter((item) => item.name.includes(name));
      }
      if (code) {
        filteredList = filteredList.filter((item) => item.code.includes(code));
      }
      if (category) {
        filteredList = filteredList.filter((item) => item.category === category);
      }
      if (nature) {
        filteredList = filteredList.filter((item) => item.nature === nature);
      }
      if (department) {
        filteredList = filteredList.filter((item) => item.department === department);
      }
      if (sort && order) {
        filteredList.sort((a, b) => {
          const sortField = sort;
          if (order === "desc") {
            return String(b[sortField]).localeCompare(String(a[sortField]));
          } else {
            return String(a[sortField]).localeCompare(String(b[sortField]));
          }
        });
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
  // 添加课程
  {
    url: "/api/course/add",
    method: "post",
    response: ({ body }) => {
      const { code, name } = body;
      const existingCourse = courseMockList.find((item) => item.code === code);
      if (existingCourse) {
        return {
          code: 1,
          message: "\u8BFE\u7A0B\u4EE3\u7801\u5DF2\u5B58\u5728"
        };
      }
      const newId = courseMockList.length > 0 ? Math.max(...courseMockList.map((item) => parseInt(item.id, 10))) + 1 : 1;
      const newCourse = {
        id: newId.toString(),
        ...body,
        totalHours: (body.theoryHours || 0) + (body.practiceHours || 0),
        createTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
        updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
      };
      courseMockList.unshift(newCourse);
      return {
        code: 0,
        data: newCourse,
        message: "\u6DFB\u52A0\u6210\u529F"
      };
    }
  },
  // 自动生成课程代码
  {
    url: "/api/course/generate-code",
    method: "post",
    response: ({ body }) => {
      const { category, nature, department } = body;
      const categoryPrefix = category ? category.charAt(0) : "C";
      const natureCode = nature === "required" ? "B" : nature === "elective" ? "X" : "L";
      const departmentCode = department || "0";
      const randomNum = Math.floor(Math.random() * 1e3).toString().padStart(3, "0");
      const generatedCode = `${categoryPrefix}${natureCode}${departmentCode}${randomNum}`;
      return {
        code: 0,
        data: {
          code: generatedCode
        },
        message: "\u751F\u6210\u6210\u529F"
      };
    }
  },
  // 获取课程详情
  {
    url: "/api/course/detail/:id",
    method: "get",
    response: ({ params }) => {
      const { id } = params;
      const course = courseMockList.find((item) => item.id === id);
      if (!course) {
        return {
          code: 1,
          message: "\u8BFE\u7A0B\u4E0D\u5B58\u5728"
        };
      }
      return {
        code: 0,
        data: course,
        message: "ok"
      };
    }
  }
];
var courseImportExportApis = [
  // 下载课程导入模板
  {
    url: "/api/course/template/download",
    method: "get",
    response: () => {
      return {
        code: 0,
        message: "\u6A21\u677F\u4E0B\u8F7D\u6210\u529F",
        data: {
          url: "http://example.com/course-template.xlsx",
          fileName: "course-template.xlsx"
        }
      };
    }
  },
  // 导入课程
  {
    url: "/api/course/import",
    method: "post",
    response: ({ body }) => {
      const mockResponse = {
        code: 0,
        message: "\u5BFC\u5165\u6210\u529F",
        data: {
          successCount: Math.floor(Math.random() * 20) + 10,
          // 模拟10-30条成功导入
          failCount: Math.floor(Math.random() * 5),
          // 模拟0-5条失败
          failList: []
        }
      };
      if (mockResponse.data.failCount > 0) {
        for (let i = 0; i < mockResponse.data.failCount; i++) {
          mockResponse.data.failList.push({
            rowIndex: Math.floor(Math.random() * 100) + 1,
            reason: ["\u8BFE\u7A0B\u4EE3\u7801\u5DF2\u5B58\u5728", "\u8BFE\u7A0B\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A", "\u5B66\u5206\u683C\u5F0F\u9519\u8BEF", "\u5F00\u8BFE\u9662\u7CFB\u4E0D\u5B58\u5728", "\u8BFE\u7A0B\u7C7B\u522B\u4E0D\u5B58\u5728"][Math.floor(Math.random() * 5)]
          });
        }
      }
      return mockResponse;
    }
  },
  // 导出课程数据
  {
    url: "/api/course/export",
    method: "post",
    response: () => {
      return {
        code: 0,
        message: "\u5BFC\u51FA\u6210\u529F",
        data: {
          url: "http://example.com/courses.xlsx",
          fileName: "\u8BFE\u7A0B\u6570\u636E_" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "") + ".xlsx"
        }
      };
    }
  },
  // 导出列表数据
  {
    url: "/api/course/export-list",
    method: "post",
    response: ({ body }) => {
      return {
        code: 0,
        message: "\u5BFC\u51FA\u6210\u529F",
        data: {
          url: "http://example.com/course-list.xlsx",
          fileName: "\u8BFE\u7A0B\u5217\u8868_" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "") + ".xlsx",
          total: body.pageSize || 0
        }
      };
    }
  }
];
var originalMockMethods = [
  {
    url: "/api/get-purchase-list",
    method: "get",
    response: () => ({
      code: 0,
      data: {
        ...Mock2.mock({
          "list|1-100": [
            {
              index: /S20201228115950[0-9][0-9][0-9]/,
              pdName: "Macbook",
              pdNum: "p_tmp_60a637cd0d",
              "purchaseNum|1-100": 100,
              adminName: "\u8D22\u52A1\u90E8111",
              updateTime: '2020-05-20@date("HH:mm:ss")',
              pdType: "\u7535\u5B50\u4EA7\u54C1"
            },
            {
              index: /S20201228115950[0-9][0-9][0-9]/,
              pdName: "Macbook",
              pdNum: "p_tmp_60a637cd0d",
              "purchaseNum|1-100": 100,
              adminName: "\u8D22\u52A1\u90E8",
              updateTime: '2020-05-20@date("HH:mm:ss")'
            }
          ]
        })
      }
    })
  },
  {
    url: "/api/get-list",
    method: "get",
    response: () => ({
      code: 0,
      data: {
        ...Mock2.mock({
          "list|1-100": [
            {
              "index|+1": 1,
              "status|1": "@natural(0, 4)",
              no: "BH00@natural(01, 100)",
              name: "@city()\u529E\u516C\u7528\u54C1\u91C7\u8D2D\u9879\u76EE",
              "paymentType|1": "@natural(0, 1)",
              "contractType|1": "@natural(0, 2)",
              updateTime: '2020-05-30 @date("HH:mm:ss")',
              amount: "@natural(10, 500),000,000",
              adminName: "@cname()"
            }
          ]
        })
      }
    })
  },
  {
    url: "/api/detail-basic",
    method: "get",
    response: () => ({
      code: 0,
      data: {
        ...Mock2.mock({
          name: "td_20023747",
          loginType: "Web",
          currentRole: "Admin",
          rightsList: "\u901A\u7528\u6743\u9650",
          userStatus: "\u542F\u7528",
          language: "\u7B80\u4F53\u4E2D\u6587",
          timeZone: "(GMT+08:00)\u4E2D\u56FD\u65F6\u533A\u2014\u5317\u4EAC\uFF08Asia/Beijing\uFF09"
        })
      }
    })
  },
  {
    url: "/api/get-card-list",
    method: "get",
    response: () => ({
      code: 0,
      data: {
        ...Mock2.mock({
          "list|48-50": [
            {
              "index|+1": 1,
              isSetup: "@boolean",
              "type|1": "@natural(1, 5)",
              "banner|1": [
                "https://tdesign.gtimg.com/starter/cloud-db.jpg",
                "https://tdesign.gtimg.com/starter/cloud-server.jpg",
                "https://tdesign.gtimg.com/starter/ssl.jpg",
                "https://tdesign.gtimg.com/starter/t-sec.jpg",
                "https://tdesign.gtimg.com/starter/face-recognition.jpg"
              ],
              "name|1": ["\u4EBA\u8138\u8BC6\u522B", "SSL\u8BC1\u4E66", "CVM", "\u4E91\u6570\u636E\u5E93", "T-Sec \u4E91\u9632\u706B\u5899"],
              "description|1": [
                "\u57FA\u4E8E\u817E\u8BAF\u4F18\u56FE\u5F3A\u5927\u7684\u9762\u90E8\u5206\u6790\u6280\u672F\uFF0C\u63D0\u4F9B\u5305\u62EC\u4EBA\u8138\u68C0\u6D4B\u4E0E\u5206\u6790\u3001\u4E94\u5B98\u5B9A\u4F4D\u3001\u4EBA\u8138\u641C\u7D22\u3001\u4EBA\u8138\u6BD4\u5BF9\u3001\u4EBA\u8138",
                "\u4E91\u786C\u76D8\u4E3A\u60A8\u63D0\u4F9B\u7528\u4E8ECVM\u7684\u6301\u4E45\u6027\u6570\u636E\u5757\u7EA7\u5B58\u50A8\u670D\u52A1\u3002\u4E91\u786C\u76D8\u4E2D\u7684\u6570\u636E\u81EA\u52A8\u5730\u53EF\u7528\u533A\u5185\u4EE5\u591A\u526F\u672C\u5197",
                "SSL\u8BC1\u4E66\u53C8\u53EB\u670D\u52A1\u5668\u8BC1\u4E66\uFF0C\u817E\u8BAF\u4E91\u4E3A\u60A8\u63D0\u4F9B\u8BC1\u4E66\u7684\u4E00\u7AD9\u5F0F\u670D\u52A1\uFF0C\u5305\u62EC\u514D\u8D39\u3001\u4ED8\u8D39\u8BC1\u4E66\u7684\u7533\u8BF7\u3001\u7BA1\u7406\u53CA\u90E8",
                "\u817E\u8BAF\u5B89\u5168\u4E91\u9632\u706B\u5899\u4EA7\u54C1\uFF0C\u662F\u817E\u8BAF\u4E91\u5B89\u5168\u56E2\u961F\u7ED3\u5408\u4E91\u539F\u751F\u7684\u4F18\u52BF\uFF0C\u81EA\u4E3B\u7814\u53D1\u7684SaaS\u5316\u9632\u706B\u5899\u4EA7\u54C1\uFF0C\u65E0\u9700\u5BA2\u65E0\u9700\u5BA2\u65E0\u9700\u5BA2\u65E0\u9700\u5BA2\u65E0\u9700\u5BA2\u65E0\u9700\u5BA2\u65E0\u9700\u5BA2",
                "\u4E91\u6570\u636E\u5E93MySQL\u4E3A\u7528\u6237\u63D0\u4F9B\u5B89\u5168\u53EF\u9760\uFF0C\u6027\u80FD\u5353\u8D8A\u3001\u6613\u4E8E\u7EF4\u62A4\u7684\u4F01\u4E1A\u7EA7\u4E91\u6570\u636E\u5E93\u670D\u52A1\u3002"
              ]
            }
          ]
        })
      }
    })
  },
  {
    url: "/api/get-project-list",
    method: "get",
    response: () => ({
      code: 0,
      data: {
        ...Mock2.mock({
          "list|1-50": [
            {
              "index|+1": 1,
              adminPhone: "+86 13587609955",
              updateTime: '2020-05-30 @date("HH:mm:ss")',
              "adminName|1": ["\u987E\u5A1F	", "\u5E38\u521A", "\u90D1\u6D0B"],
              "name|1": [
                "\u6CA7\u5DDE\u5E02\u529E\u516C\u7528\u54C1\u91C7\u8D2D\u9879\u76EE",
                "\u7EA2\u6CB3\u54C8\u5C3C\u65CF\u5F5D\u65CF\u81EA\u6CBB\u5DDE\u529E\u516C\u7528\u54C1\u91C7\u8D2D\u9879\u76EE	",
                "\u94DC\u5DDD\u5E02\u529E\u516C\u7528\u54C1\u91C7\u8D2D\u9879\u76EE",
                "\u9647\u5357\u5E02\u529E\u516C\u7528\u54C1\u91C7\u8D2D\u9879\u76EE	",
                "\u516D\u5B89\u5E02\u529E\u516C\u7528\u54C1\u91C7\u8D2D\u9879\u76EE	 "
              ]
            }
          ]
        })
      }
    })
  },
  {
    url: "/api/post",
    method: "post",
    timeout: 2e3,
    response: {
      code: 0,
      data: {
        name: "vben"
      }
    }
  },
  {
    url: "/api/get-menu-list-i18n",
    method: "get",
    timeout: 2e3,
    response: {
      code: 0,
      data: {
        ...Mock2.mock({
          list: [
            {
              path: "/list",
              name: "list",
              component: "LAYOUT",
              redirect: "/list/base",
              meta: {
                title: {
                  zh_CN: "\u5217\u8868\u9875",
                  en_US: "List"
                },
                icon: "view-list"
              },
              children: [
                {
                  path: "base",
                  name: "ListBase",
                  component: "/list/base/index",
                  meta: {
                    title: {
                      zh_CN: "\u57FA\u7840\u5217\u8868\u9875",
                      en_US: "Base List"
                    }
                  }
                },
                {
                  path: "card",
                  name: "ListCard",
                  component: "/list/card/index",
                  meta: {
                    title: {
                      zh_CN: "\u5361\u7247\u5217\u8868\u9875",
                      en_US: "Card List"
                    }
                  }
                },
                {
                  path: "filter",
                  name: "ListFilter",
                  component: "/list/filter/index",
                  meta: {
                    title: {
                      zh_CN: "\u7B5B\u9009\u5217\u8868\u9875",
                      en_US: "Filter List"
                    }
                  }
                },
                {
                  path: "tree",
                  name: "ListTree",
                  component: "/list/tree/index",
                  meta: {
                    title: {
                      zh_CN: "\u6811\u72B6\u7B5B\u9009\u5217\u8868\u9875",
                      en_US: "Tree List"
                    }
                  }
                }
              ]
            },
            {
              path: "/form",
              name: "form",
              component: "LAYOUT",
              redirect: "/form/base",
              meta: {
                title: {
                  zh_CN: "\u8868\u5355\u9875",
                  en_US: "Form"
                },
                icon: "edit-1"
              },
              children: [
                {
                  path: "base",
                  name: "FormBase",
                  component: "/form/base/index",
                  meta: {
                    title: {
                      zh_CN: "\u57FA\u7840\u8868\u5355\u9875",
                      en_US: "Base Form"
                    }
                  }
                },
                {
                  path: "step",
                  name: "FormStep",
                  component: "/form/step/index",
                  meta: {
                    title: {
                      zh_CN: "\u5206\u6B65\u8868\u5355\u9875",
                      en_US: "Step Form"
                    }
                  }
                }
              ]
            },
            {
              path: "/detail",
              name: "detail",
              component: "LAYOUT",
              redirect: "/detail/base",
              meta: {
                title: {
                  zh_CN: "\u8BE6\u60C5\u9875",
                  en_US: "Detail"
                },
                icon: "layers"
              },
              children: [
                {
                  path: "base",
                  name: "DetailBase",
                  component: "/detail/base/index",
                  meta: {
                    title: {
                      zh_CN: "\u57FA\u7840\u8BE6\u60C5\u9875",
                      en_US: "Base Detail"
                    }
                  }
                },
                {
                  path: "advanced",
                  name: "DetailAdvanced",
                  component: "/detail/advanced/index",
                  meta: {
                    title: {
                      zh_CN: "\u591A\u5361\u7247\u8BE6\u60C5\u9875",
                      en_US: "Card Detail"
                    }
                  }
                },
                {
                  path: "deploy",
                  name: "DetailDeploy",
                  component: "/detail/deploy/index",
                  meta: {
                    title: {
                      zh_CN: "\u6570\u636E\u8BE6\u60C5\u9875",
                      en_US: "Data Detail"
                    }
                  }
                },
                {
                  path: "secondary",
                  name: "DetailSecondary",
                  component: "/detail/secondary/index",
                  meta: {
                    title: {
                      zh_CN: "\u4E8C\u7EA7\u8BE6\u60C5\u9875",
                      en_US: "Secondary Detail"
                    }
                  }
                }
              ]
            },
            {
              path: "/frame",
              name: "Frame",
              component: "Layout",
              redirect: "/frame/doc",
              meta: {
                icon: "internet",
                title: {
                  zh_CN: "\u5916\u90E8\u9875\u9762",
                  en_US: "External"
                }
              },
              children: [
                {
                  path: "doc",
                  name: "Doc",
                  component: "IFrame",
                  meta: {
                    frameSrc: "https://tdesign.tencent.com/starter/docs/vue-next/get-started",
                    title: {
                      zh_CN: "\u4F7F\u7528\u6587\u6863\uFF08\u5185\u5D4C\uFF09",
                      en_US: "Documentation(IFrame)"
                    }
                  }
                },
                {
                  path: "TDesign",
                  name: "TDesign",
                  component: "IFrame",
                  meta: {
                    frameSrc: "https://tdesign.tencent.com/vue-next/getting-started",
                    title: {
                      zh_CN: "TDesign \u6587\u6863\uFF08\u5185\u5D4C\uFF09",
                      en_US: "TDesign (IFrame)"
                    }
                  }
                },
                {
                  path: "TDesign2",
                  name: "TDesign2",
                  component: "IFrame",
                  meta: {
                    frameSrc: "https://tdesign.tencent.com/vue-next/getting-started",
                    frameBlank: true,
                    title: {
                      zh_CN: "TDesign \u6587\u6863\uFF08\u5916\u94FE",
                      en_US: "TDesign Doc(Link)"
                    }
                  }
                }
              ]
            }
          ]
        })
      }
    }
  },
  // 基础数据-维护
  {
    url: "/api/system/basic-data/maintenance/list",
    method: "get",
    response: () => ({
      code: 0,
      data: {
        common: [
          {
            id: "1",
            type: "common",
            code: "SEX",
            name: "\u6027\u522B",
            value: '{"male":"\u7537","female":"\u5973"}',
            sort: 1,
            remark: "\u7528\u6237\u6027\u522B\u9009\u9879",
            isActive: true,
            createTime: "2023-01-15 08:30:00",
            updateTime: "2023-03-20 14:22:30"
          },
          {
            id: "2",
            type: "common",
            code: "STATUS",
            name: "\u72B6\u6001",
            value: '{"0":"\u7981\u7528","1":"\u542F\u7528"}',
            sort: 2,
            remark: "\u901A\u7528\u72B6\u6001\u9009\u9879",
            isActive: true,
            createTime: "2023-01-16 10:20:00",
            updateTime: "2023-02-28 11:30:45"
          }
        ],
        academic: [
          {
            id: "3",
            type: "academic",
            code: "DEGREE",
            name: "\u5B66\u4F4D",
            value: '{"bachelor":"\u5B66\u58EB","master":"\u7855\u58EB","doctor":"\u535A\u58EB"}',
            sort: 1,
            remark: "\u5B66\u4F4D\u7C7B\u578B",
            isActive: true,
            createTime: "2023-01-18 13:45:00",
            updateTime: "2023-03-15 16:42:10"
          }
        ],
        system: [
          {
            id: "4",
            type: "system",
            code: "USER_TYPE",
            name: "\u7528\u6237\u7C7B\u578B",
            value: '{"admin":"\u7BA1\u7406\u5458","teacher":"\u6559\u5E08","student":"\u5B66\u751F"}',
            sort: 1,
            remark: "\u7CFB\u7EDF\u7528\u6237\u7C7B\u578B",
            isActive: true,
            createTime: "2023-02-01 09:20:00",
            updateTime: "2023-03-10 09:15:25"
          },
          {
            id: "5",
            type: "system",
            code: "LOG_TYPE",
            name: "\u65E5\u5FD7\u7C7B\u578B",
            value: '{"login":"\u767B\u5F55\u65E5\u5FD7","operation":"\u64CD\u4F5C\u65E5\u5FD7","error":"\u9519\u8BEF\u65E5\u5FD7"}',
            sort: 2,
            remark: "\u7CFB\u7EDF\u65E5\u5FD7\u7C7B\u578B",
            isActive: true,
            createTime: "2023-02-05 11:30:00",
            updateTime: "2023-03-05 10:20:15"
          }
        ]
      }
    })
  },
  // 基础数据-维护-添加
  {
    url: "/api/system/basic-data/maintenance/add",
    method: "post",
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          id: `${Date.now()}`,
          createTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
          updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
        },
        message: "\u6DFB\u52A0\u6210\u529F"
      };
    }
  },
  // 基础数据-维护-更新
  {
    url: "/api/system/basic-data/maintenance/update",
    method: "post",
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
        },
        message: "\u66F4\u65B0\u6210\u529F"
      };
    }
  },
  // 基础数据-维护-删除
  {
    url: "/api/system/basic-data/maintenance/delete",
    method: "post",
    response: () => {
      return {
        code: 0,
        message: "\u5220\u9664\u6210\u529F"
      };
    }
  },
  // 基础数据-学院信息
  {
    url: "/api/system/basic-data/college/list",
    method: "get",
    response: () => ({
      code: 0,
      data: [
        {
          id: "1",
          code: "CS",
          name: "\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u5DE5\u7A0B\u5B66\u9662",
          enName: "College of Computer Science and Engineering",
          shortName: "\u8BA1\u7B97\u673A\u5B66\u9662",
          phone: "010-12345678",
          email: "cs@example.edu.cn",
          foundTime: "1985-09-01",
          sort: 1,
          status: true,
          remark: "\u8D1F\u8D23\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F\u3001\u8F6F\u4EF6\u5DE5\u7A0B\u3001\u7F51\u7EDC\u5DE5\u7A0B\u7B49\u4E13\u4E1A\u7684\u6559\u5B66\u4E0E\u7BA1\u7406",
          createTime: "2023-01-15 08:30:00",
          updateTime: "2023-03-20 14:22:30"
        },
        {
          id: "2",
          code: "EE",
          name: "\u7535\u5B50\u5DE5\u7A0B\u5B66\u9662",
          enName: "College of Electronic Engineering",
          shortName: "\u7535\u5B50\u5B66\u9662",
          phone: "010-12345679",
          email: "ee@example.edu.cn",
          foundTime: "1978-09-01",
          sort: 2,
          status: true,
          remark: "\u8D1F\u8D23\u7535\u5B50\u4FE1\u606F\u5DE5\u7A0B\u3001\u901A\u4FE1\u5DE5\u7A0B\u3001\u7535\u5B50\u79D1\u5B66\u4E0E\u6280\u672F\u7B49\u4E13\u4E1A\u7684\u6559\u5B66\u4E0E\u7BA1\u7406",
          createTime: "2023-01-16 10:20:00",
          updateTime: "2023-02-28 11:30:45"
        },
        {
          id: "3",
          code: "MA",
          name: "\u6570\u5B66\u4E0E\u7EDF\u8BA1\u5B66\u9662",
          enName: "College of Mathematics and Statistics",
          shortName: "\u6570\u7EDF\u5B66\u9662",
          phone: "010-12345680",
          email: "math@example.edu.cn",
          foundTime: "1952-09-01",
          sort: 3,
          status: true,
          remark: "\u8D1F\u8D23\u6570\u5B66\u4E0E\u5E94\u7528\u6570\u5B66\u3001\u7EDF\u8BA1\u5B66\u3001\u6570\u636E\u79D1\u5B66\u4E0E\u5927\u6570\u636E\u6280\u672F\u7B49\u4E13\u4E1A\u7684\u6559\u5B66\u4E0E\u7BA1\u7406",
          createTime: "2023-01-18 13:45:00",
          updateTime: "2023-03-15 16:42:10"
        },
        {
          id: "4",
          code: "ME",
          name: "\u673A\u68B0\u5DE5\u7A0B\u5B66\u9662",
          enName: "College of Mechanical Engineering",
          shortName: "\u673A\u68B0\u5B66\u9662",
          phone: "010-12345681",
          email: "me@example.edu.cn",
          foundTime: "1955-09-01",
          sort: 4,
          status: true,
          remark: "\u8D1F\u8D23\u673A\u68B0\u8BBE\u8BA1\u5236\u9020\u53CA\u5176\u81EA\u52A8\u5316\u3001\u673A\u68B0\u7535\u5B50\u5DE5\u7A0B\u7B49\u4E13\u4E1A\u7684\u6559\u5B66\u4E0E\u7BA1\u7406",
          createTime: "2023-02-01 09:20:00",
          updateTime: "2023-03-10 09:15:25"
        },
        {
          id: "5",
          code: "FL",
          name: "\u5916\u56FD\u8BED\u5B66\u9662",
          enName: "College of Foreign Languages",
          shortName: "\u5916\u8BED\u5B66\u9662",
          phone: "010-12345682",
          email: "fl@example.edu.cn",
          foundTime: "1960-09-01",
          sort: 5,
          status: true,
          remark: "\u8D1F\u8D23\u82F1\u8BED\u3001\u65E5\u8BED\u3001\u4FC4\u8BED\u7B49\u4E13\u4E1A\u7684\u6559\u5B66\u4E0E\u7BA1\u7406",
          createTime: "2023-02-05 11:30:00",
          updateTime: "2023-03-05 10:20:15"
        }
      ]
    })
  },
  // 基础数据-学院信息-添加
  {
    url: "/api/system/basic-data/college/add",
    method: "post",
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          id: `${Date.now()}`,
          createTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
          updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
        },
        message: "\u6DFB\u52A0\u6210\u529F"
      };
    }
  },
  // 基础数据-学院信息-更新
  {
    url: "/api/system/basic-data/college/update",
    method: "post",
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
        },
        message: "\u66F4\u65B0\u6210\u529F"
      };
    }
  },
  // 基础数据-学院信息-删除
  {
    url: "/api/system/basic-data/college/delete",
    method: "post",
    response: () => {
      return {
        code: 0,
        message: "\u5220\u9664\u6210\u529F"
      };
    }
  },
  // 基础数据-专业信息
  {
    url: "/api/system/basic-data/major/list",
    method: "get",
    response: () => ({
      code: 0,
      data: [
        {
          id: "1",
          code: "080901",
          name: "\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F",
          enName: "Computer Science and Technology",
          shortName: "\u8BA1\u79D1",
          collegeId: "1",
          studyYears: "4",
          degreeType: "engineering",
          foundTime: "1985-09-01",
          sort: 1,
          status: true,
          remark: "\u8BA1\u7B97\u673A\u9886\u57DF\u6838\u5FC3\u4E13\u4E1A",
          createTime: "2023-01-15 08:30:00",
          updateTime: "2023-03-20 14:22:30"
        },
        {
          id: "2",
          code: "080902",
          name: "\u8F6F\u4EF6\u5DE5\u7A0B",
          enName: "Software Engineering",
          shortName: "\u8F6F\u5DE5",
          collegeId: "1",
          studyYears: "4",
          degreeType: "engineering",
          foundTime: "1998-09-01",
          sort: 2,
          status: true,
          remark: "\u8F6F\u4EF6\u5F00\u53D1\u4E0E\u5DE5\u7A0B\u7BA1\u7406\u4E13\u4E1A",
          createTime: "2023-01-16 10:20:00",
          updateTime: "2023-02-28 11:30:45"
        },
        {
          id: "3",
          code: "080903",
          name: "\u7F51\u7EDC\u5DE5\u7A0B",
          enName: "Network Engineering",
          shortName: "\u7F51\u5DE5",
          collegeId: "1",
          studyYears: "4",
          degreeType: "engineering",
          foundTime: "2002-09-01",
          sort: 3,
          status: true,
          remark: "\u8BA1\u7B97\u673A\u7F51\u7EDC\u6280\u672F\u4E13\u4E1A",
          createTime: "2023-01-18 13:45:00",
          updateTime: "2023-03-15 16:42:10"
        },
        {
          id: "4",
          code: "080701",
          name: "\u7535\u5B50\u4FE1\u606F\u5DE5\u7A0B",
          enName: "Electronic Information Engineering",
          shortName: "\u7535\u4FE1",
          collegeId: "2",
          studyYears: "4",
          degreeType: "engineering",
          foundTime: "1980-09-01",
          sort: 1,
          status: true,
          remark: "\u7535\u5B50\u4FE1\u606F\u6280\u672F\u4E13\u4E1A",
          createTime: "2023-02-01 09:20:00",
          updateTime: "2023-03-10 09:15:25"
        },
        {
          id: "5",
          code: "080702",
          name: "\u901A\u4FE1\u5DE5\u7A0B",
          enName: "Communication Engineering",
          shortName: "\u901A\u4FE1",
          collegeId: "2",
          studyYears: "4",
          degreeType: "engineering",
          foundTime: "1982-09-01",
          sort: 2,
          status: true,
          remark: "\u901A\u4FE1\u6280\u672F\u4E13\u4E1A",
          createTime: "2023-02-05 11:30:00",
          updateTime: "2023-03-05 10:20:15"
        },
        {
          id: "6",
          code: "070101",
          name: "\u6570\u5B66\u4E0E\u5E94\u7528\u6570\u5B66",
          enName: "Mathematics and Applied Mathematics",
          shortName: "\u6570\u5B66",
          collegeId: "3",
          studyYears: "4",
          degreeType: "science",
          foundTime: "1960-09-01",
          sort: 1,
          status: true,
          remark: "\u6570\u5B66\u7406\u8BBA\u4E0E\u5E94\u7528\u4E13\u4E1A",
          createTime: "2023-02-10 14:25:00",
          updateTime: "2023-03-18 09:30:15"
        },
        {
          id: "7",
          code: "080201",
          name: "\u673A\u68B0\u5DE5\u7A0B",
          enName: "Mechanical Engineering",
          shortName: "\u673A\u68B0",
          collegeId: "4",
          studyYears: "4",
          degreeType: "engineering",
          foundTime: "1958-09-01",
          sort: 1,
          status: true,
          remark: "\u673A\u68B0\u8BBE\u8BA1\u4E0E\u5236\u9020\u4E13\u4E1A",
          createTime: "2023-02-15 10:15:00",
          updateTime: "2023-03-22 14:10:25"
        },
        {
          id: "8",
          code: "050201",
          name: "\u82F1\u8BED",
          enName: "English",
          shortName: "\u82F1\u8BED",
          collegeId: "5",
          studyYears: "4",
          degreeType: "literature",
          foundTime: "1962-09-01",
          sort: 1,
          status: true,
          remark: "\u82F1\u8BED\u8BED\u8A00\u6587\u5B66\u4E13\u4E1A",
          createTime: "2023-02-20 11:45:00",
          updateTime: "2023-03-25 16:20:30"
        }
      ]
    })
  },
  // 基础数据-学院列表（简化版，用于下拉选择）
  {
    url: "/api/system/basic-data/college/select",
    method: "get",
    response: () => ({
      code: 0,
      data: [
        { id: "1", code: "CS", name: "\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u5DE5\u7A0B\u5B66\u9662" },
        { id: "2", code: "EE", name: "\u7535\u5B50\u5DE5\u7A0B\u5B66\u9662" },
        { id: "3", code: "MA", name: "\u6570\u5B66\u4E0E\u7EDF\u8BA1\u5B66\u9662" },
        { id: "4", code: "ME", name: "\u673A\u68B0\u5DE5\u7A0B\u5B66\u9662" },
        { id: "5", code: "FL", name: "\u5916\u56FD\u8BED\u5B66\u9662" }
      ]
    })
  },
  // 基础数据-专业信息-添加
  {
    url: "/api/system/basic-data/major/add",
    method: "post",
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          id: `${Date.now()}`,
          createTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
          updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
        },
        message: "\u6DFB\u52A0\u6210\u529F"
      };
    }
  },
  // 基础数据-专业信息-更新
  {
    url: "/api/system/basic-data/major/update",
    method: "post",
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
        },
        message: "\u66F4\u65B0\u6210\u529F"
      };
    }
  },
  // 基础数据-专业信息-删除
  {
    url: "/api/system/basic-data/major/delete",
    method: "post",
    response: () => {
      return {
        code: 0,
        message: "\u5220\u9664\u6210\u529F"
      };
    }
  },
  // 课程代码规则相关接口
  {
    url: "/api/course-code-rules",
    method: "get",
    response: () => {
      return {
        code: 0,
        data: {
          list: [
            {
              id: "1",
              name: "\u8BA1\u7B97\u673A\u4E13\u4E1A\u8BFE\u7A0B\u4EE3\u7801\u89C4\u5219",
              prefix: "CS",
              startNum: 1001,
              currentNum: 1045,
              digitLength: 4,
              courseNature: "\u4E13\u4E1A\u5FC5\u4FEE\u8BFE",
              department: "\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F\u5B66\u9662",
              courseCategory: "\u4E13\u4E1A\u57FA\u7840\u8BFE",
              courseType: "\u7406\u8BBA\u8BFE",
              examType: "\u8003\u8BD5",
              courseAttr: "\u5B66\u4F4D\u8BFE",
              credit: 4,
              serialNumber: "A",
              isActive: true,
              createTime: "2023-01-15 08:30:00",
              updateTime: "2023-03-20 14:22:30"
            },
            {
              id: "2",
              name: "\u7535\u5B50\u4FE1\u606F\u5DE5\u7A0B\u8BFE\u7A0B\u4EE3\u7801\u89C4\u5219",
              prefix: "EE",
              startNum: 2001,
              currentNum: 2023,
              digitLength: 4,
              courseNature: "\u4E13\u4E1A\u9009\u4FEE\u8BFE",
              department: "\u7535\u5B50\u4FE1\u606F\u5DE5\u7A0B\u5B66\u9662",
              courseCategory: "\u4E13\u4E1A\u65B9\u5411\u8BFE",
              courseType: "\u5B9E\u9A8C\u8BFE",
              examType: "\u8003\u67E5",
              courseAttr: "\u975E\u5B66\u4F4D\u8BFE",
              credit: 2,
              serialNumber: "B",
              isActive: true,
              createTime: "2023-01-15 09:15:00",
              updateTime: "2023-02-28 11:30:45"
            },
            {
              id: "3",
              name: "\u8F6F\u4EF6\u5DE5\u7A0B\u8BFE\u7A0B\u4EE3\u7801\u89C4\u5219",
              prefix: "SE",
              startNum: 3001,
              currentNum: 3012,
              digitLength: 4,
              courseNature: "\u516C\u5171\u5FC5\u4FEE\u8BFE",
              department: "\u8F6F\u4EF6\u5B66\u9662",
              courseCategory: "\u901A\u8BC6\u8BFE",
              courseType: "\u7406\u8BBA\u5B9E\u8DF5\u8BFE",
              examType: "\u8003\u8BD5",
              courseAttr: "\u5B66\u4F4D\u8BFE",
              credit: 3,
              serialNumber: "C",
              isActive: true,
              createTime: "2023-01-16 10:20:00",
              updateTime: "2023-03-15 16:42:10"
            },
            {
              id: "4",
              name: "\u4EBA\u5DE5\u667A\u80FD\u8BFE\u7A0B\u4EE3\u7801\u89C4\u5219",
              prefix: "AI",
              startNum: 4001,
              currentNum: 4008,
              digitLength: 4,
              courseNature: "\u516C\u5171\u9009\u4FEE\u8BFE",
              department: "\u4EBA\u5DE5\u667A\u80FD\u5B66\u9662",
              courseCategory: "\u4E13\u4E1A\u6838\u5FC3\u8BFE",
              courseType: "\u5B9E\u8DF5\u8BFE",
              examType: "\u8003\u67E5",
              courseAttr: "\u975E\u5B66\u4F4D\u8BFE",
              credit: 2,
              serialNumber: "D",
              isActive: false,
              createTime: "2023-02-05 13:45:00",
              updateTime: "2023-03-10 09:15:25"
            },
            {
              id: "5",
              name: "\u6570\u636E\u79D1\u5B66\u8BFE\u7A0B\u4EE3\u7801\u89C4\u5219",
              prefix: "DS",
              startNum: 5001,
              currentNum: 5005,
              digitLength: 4,
              courseNature: "\u901A\u8BC6\u9009\u4FEE\u8BFE",
              department: "\u6570\u636E\u79D1\u5B66\u5B66\u9662",
              courseCategory: "\u521B\u65B0\u521B\u4E1A\u8BFE",
              courseType: "\u7406\u8BBA\u8BFE",
              examType: "\u8003\u8BD5",
              courseAttr: "\u5B66\u4F4D\u8BFE",
              credit: 1,
              serialNumber: "E",
              isActive: true,
              createTime: "2023-02-10 15:30:00",
              updateTime: "2023-03-05 10:20:15"
            }
          ],
          total: 5
        }
      };
    }
  },
  {
    url: "/api/course-code-rules/:id",
    method: "get",
    response: ({ query }) => {
      const { id } = query;
      const rule = {
        id,
        name: `\u8BFE\u7A0B\u4EE3\u7801\u89C4\u5219${id}`,
        prefix: ["CS", "EE", "SE", "AI", "DS"][parseInt(id) % 5],
        startNum: 1e3 + parseInt(id) * 10,
        currentNum: 1e3 + parseInt(id) * 10 + 5,
        digitLength: 4,
        courseNature: ["\u4E13\u4E1A\u5FC5\u4FEE\u8BFE", "\u4E13\u4E1A\u9009\u4FEE\u8BFE", "\u516C\u5171\u5FC5\u4FEE\u8BFE", "\u516C\u5171\u9009\u4FEE\u8BFE", "\u901A\u8BC6\u9009\u4FEE\u8BFE"][parseInt(id) % 5],
        department: ["\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F\u5B66\u9662", "\u7535\u5B50\u4FE1\u606F\u5DE5\u7A0B\u5B66\u9662", "\u8F6F\u4EF6\u5B66\u9662", "\u4EBA\u5DE5\u667A\u80FD\u5B66\u9662", "\u6570\u636E\u79D1\u5B66\u5B66\u9662"][parseInt(id) % 5],
        courseCategory: ["\u4E13\u4E1A\u57FA\u7840\u8BFE", "\u4E13\u4E1A\u65B9\u5411\u8BFE", "\u901A\u8BC6\u8BFE", "\u4E13\u4E1A\u6838\u5FC3\u8BFE", "\u521B\u65B0\u521B\u4E1A\u8BFE"][parseInt(id) % 5],
        courseType: ["\u7406\u8BBA\u8BFE", "\u5B9E\u9A8C\u8BFE", "\u7406\u8BBA\u5B9E\u8DF5\u8BFE", "\u5B9E\u8DF5\u8BFE", "\u7406\u8BBA\u8BFE"][parseInt(id) % 5],
        examType: ["\u8003\u8BD5", "\u8003\u67E5", "\u8003\u8BD5", "\u8003\u67E5", "\u8003\u8BD5"][parseInt(id) % 5],
        courseAttr: ["\u5B66\u4F4D\u8BFE", "\u975E\u5B66\u4F4D\u8BFE", "\u5B66\u4F4D\u8BFE", "\u975E\u5B66\u4F4D\u8BFE", "\u5B66\u4F4D\u8BFE"][parseInt(id) % 5],
        credit: [4, 2, 3, 2, 1][parseInt(id) % 5],
        serialNumber: ["A", "B", "C", "D", "E"][parseInt(id) % 5],
        isActive: Boolean(parseInt(id) % 2),
        createTime: "2023-01-15 08:30:00",
        updateTime: "2023-03-20 14:22:30"
      };
      return {
        code: 0,
        data: rule
      };
    }
  },
  {
    url: "/api/course-code-rules",
    method: "post",
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          id: `${Date.now()}`,
          createTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
          updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
        }
      };
    }
  },
  {
    url: "/api/course-code-rules/:id",
    method: "put",
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
        }
      };
    }
  },
  {
    url: "/api/course-code-rules/:id",
    method: "delete",
    response: ({ query }) => {
      return {
        code: 0,
        data: {
          id: query.id
        }
      };
    }
  }
];
var courseCodeRulesMock = [
  {
    url: "/api/course-library/code-rules",
    method: "get",
    response: () => {
      return {
        code: 0,
        data: {
          list: [
            {
              id: "1",
              name: "\u8BA1\u7B97\u673A\u4E13\u4E1A\u8BFE\u7A0B\u4EE3\u7801\u89C4\u5219",
              prefix: "CS",
              startNum: 1001,
              currentNum: 1045,
              digitLength: 4,
              courseNature: "\u4E13\u4E1A\u5FC5\u4FEE\u8BFE",
              department: "\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F\u5B66\u9662",
              courseCategory: "\u4E13\u4E1A\u57FA\u7840\u8BFE",
              courseType: "\u7406\u8BBA\u8BFE",
              examType: "\u8003\u8BD5",
              courseAttr: "\u5B66\u4F4D\u8BFE",
              credit: 4,
              serialNumber: "A",
              isActive: true,
              createTime: "2023-01-15 08:30:00",
              updateTime: "2023-03-20 14:22:30",
              components: [
                {
                  order: 1,
                  type: "department",
                  codeType: "system",
                  digitType: "prefix",
                  digitCount: 2
                },
                {
                  order: 2,
                  type: "courseNature",
                  codeType: "system",
                  digitType: "suffix",
                  digitCount: 1
                },
                {
                  order: 3,
                  type: "serialNumber",
                  codeType: "system",
                  digitType: "suffix",
                  digitCount: 3
                }
              ]
            },
            {
              id: "2",
              name: "\u7535\u5B50\u4FE1\u606F\u5DE5\u7A0B\u8BFE\u7A0B\u4EE3\u7801\u89C4\u5219",
              prefix: "EE",
              startNum: 2001,
              currentNum: 2023,
              digitLength: 4,
              courseNature: "\u4E13\u4E1A\u9009\u4FEE\u8BFE",
              department: "\u7535\u5B50\u4FE1\u606F\u5DE5\u7A0B\u5B66\u9662",
              courseCategory: "\u4E13\u4E1A\u65B9\u5411\u8BFE",
              courseType: "\u5B9E\u9A8C\u8BFE",
              examType: "\u8003\u67E5",
              courseAttr: "\u975E\u5B66\u4F4D\u8BFE",
              credit: 2,
              serialNumber: "B",
              isActive: true,
              createTime: "2023-01-15 09:15:00",
              updateTime: "2023-02-28 11:30:45",
              components: [
                {
                  order: 1,
                  type: "department",
                  codeType: "system",
                  digitType: "prefix",
                  digitCount: 2
                },
                {
                  order: 2,
                  type: "courseType",
                  codeType: "system",
                  digitType: "suffix",
                  digitCount: 1
                },
                {
                  order: 3,
                  type: "serialNumber",
                  codeType: "system",
                  digitType: "suffix",
                  digitCount: 3
                }
              ]
            }
          ],
          total: 2
        }
      };
    }
  },
  {
    url: "/api/course-library/code-rules/:id",
    method: "get",
    response: ({ query }) => {
      const { id } = query;
      const rule = {
        id,
        name: `\u8BFE\u7A0B\u4EE3\u7801\u89C4\u5219${id}`,
        prefix: ["CS", "EE", "SE", "AI", "DS"][parseInt(id) % 5],
        startSerialNumber: 1e3 + parseInt(id) * 10,
        currentSerialNumber: 1e3 + parseInt(id) * 10 + 5,
        serialNumberLength: 4,
        courseNature: ["\u4E13\u4E1A\u5FC5\u4FEE\u8BFE", "\u4E13\u4E1A\u9009\u4FEE\u8BFE", "\u516C\u5171\u5FC5\u4FEE\u8BFE", "\u516C\u5171\u9009\u4FEE\u8BFE", "\u901A\u8BC6\u9009\u4FEE\u8BFE"][parseInt(id) % 5],
        department: ["\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F\u5B66\u9662", "\u7535\u5B50\u4FE1\u606F\u5DE5\u7A0B\u5B66\u9662", "\u8F6F\u4EF6\u5B66\u9662", "\u4EBA\u5DE5\u667A\u80FD\u5B66\u9662", "\u6570\u636E\u79D1\u5B66\u5B66\u9662"][parseInt(id) % 5],
        courseCategory: ["\u4E13\u4E1A\u57FA\u7840\u8BFE", "\u4E13\u4E1A\u65B9\u5411\u8BFE", "\u901A\u8BC6\u8BFE", "\u4E13\u4E1A\u6838\u5FC3\u8BFE", "\u521B\u65B0\u521B\u4E1A\u8BFE"][parseInt(id) % 5],
        courseType: ["\u7406\u8BBA\u8BFE", "\u5B9E\u9A8C\u8BFE", "\u7406\u8BBA\u5B9E\u8DF5\u8BFE", "\u5B9E\u8DF5\u8BFE", "\u7406\u8BBA\u8BFE"][parseInt(id) % 5],
        examType: ["\u8003\u8BD5", "\u8003\u67E5", "\u8003\u8BD5", "\u8003\u67E5", "\u8003\u8BD5"][parseInt(id) % 5],
        courseAttr: ["\u5B66\u4F4D\u8BFE", "\u975E\u5B66\u4F4D\u8BFE", "\u5B66\u4F4D\u8BFE", "\u975E\u5B66\u4F4D\u8BFE", "\u5B66\u4F4D\u8BFE"][parseInt(id) % 5],
        credit: [4, 2, 3, 2, 1][parseInt(id) % 5],
        isActive: Boolean(parseInt(id) % 2),
        createTime: "2023-01-15 08:30:00",
        updateTime: "2023-03-20 14:22:30",
        components: [
          {
            order: 1,
            type: "department",
            codeType: "system",
            digitType: "prefix",
            digitCount: 2
          },
          {
            order: 2,
            type: parseInt(id) % 2 === 0 ? "courseNature" : "courseType",
            codeType: "system",
            digitType: "suffix",
            digitCount: 1
          },
          {
            order: 3,
            type: "serialNumber",
            codeType: "system",
            digitType: "suffix",
            digitCount: 3
          }
        ],
        description: `\u8FD9\u662F\u8BFE\u7A0B\u4EE3\u7801\u89C4\u5219${id}\u7684\u8BF4\u660E`
      };
      return {
        code: 0,
        data: rule
      };
    }
  },
  {
    url: "/api/course-library/code-rules",
    method: "post",
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          id: `${Date.now()}`,
          createTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
          updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
        }
      };
    }
  },
  {
    url: "/api/course-library/code-rules/:id",
    method: "put",
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          ...body,
          updateTime: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
        }
      };
    }
  },
  {
    url: "/api/course-library/code-rules/:id",
    method: "delete",
    response: ({ query }) => {
      return {
        code: 0,
        data: {
          id: query.id
        }
      };
    }
  }
];
var mock_default = [...originalMockMethods, ...courseApis, ...courseImportExportApis, ...courseCodeRulesMock, ...course_browse_default];
export {
  mock_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibW9jay9pbmRleC50cyIsICJtb2NrL2NvdXJzZS1icm93c2UudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSEMuUlxcXFxEZXNrdG9wXFxcXGNoYXRcXFxcU1JQXFxcXE5TUlBcXFxcUlBcXFxcbW9ja1xcXFxpbmRleC50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxIQy5SXFxcXERlc2t0b3BcXFxcY2hhdFxcXFxTUlBcXFxcTlNSUFxcXFxSUFxcXFxtb2NrXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9DOi9Vc2Vycy9IQy5SL0Rlc2t0b3AvY2hhdC9TUlAvTlNSUC9SUC9tb2NrL2luZGV4LnRzXCI7aW1wb3J0IE1vY2sgZnJvbSAnbW9ja2pzJztcbmltcG9ydCB7IE1vY2tNZXRob2QgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJztcbmltcG9ydCBjb3Vyc2VDb2RlUnVsZXNNb2NrIGZyb20gJy4vY291cnNlLWNvZGUtcnVsZXMnO1xuaW1wb3J0IGNvdXJzZUJyb3dzZUFwaXMgZnJvbSAnLi9jb3Vyc2UtYnJvd3NlJztcblxuLy8gXHU4QkZFXHU3QTBCXHU1MjE3XHU4ODY4bW9ja1x1NjU3MFx1NjM2RVxuY29uc3QgY291cnNlTW9ja0xpc3QgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAzNSB9KS5tYXAoKF8sIGluZGV4KSA9PiAoe1xuICBpZDogYCR7aW5kZXggKyAxfWAsXG4gIGNvZGU6IGBDJHsoMTAwMDAgKyBpbmRleCkudG9TdHJpbmcoKX1gLFxuICBuYW1lOiBgXHU3OTNBXHU0RjhCXHU4QkZFXHU3QTBCJHtpbmRleCArIDF9YCxcbiAgZW5nbGlzaE5hbWU6IGBFeGFtcGxlIENvdXJzZSAke2luZGV4ICsgMX1gLFxuICBjYXRlZ29yeTogWydcdTUxNkNcdTUxNzFcdTU3RkFcdTc4NDBcdThCRkUnLCAnXHU0RTEzXHU0RTFBXHU1N0ZBXHU3ODQwXHU4QkZFJywgJ1x1NEUxM1x1NEUxQVx1OEJGRScsICdcdTVCOUVcdThERjVcdTY1NTlcdTVCNjYnLCAnXHU5MDFBXHU4QkM2XHU5MDA5XHU0RkVFXHU4QkZFJ11bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSldLFxuICBuYXR1cmU6IFsnXHU1RkM1XHU0RkVFJywgJ1x1OTAwOVx1NEZFRScsICdcdTk2NTBcdTkwMDknXVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAzKV0sXG4gIGNyZWRpdHM6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpICsgMSxcbiAgdGhlb3J5SG91cnM6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMwKSArIDEwLFxuICBwcmFjdGljZUhvdXJzOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyMCksXG4gIHRvdGFsSG91cnM6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUwKSArIDIwLFxuICBleGFtVHlwZTogWydcdTgwMDNcdThCRDUnLCAnXHU4MDAzXHU2N0U1JywgJ1x1OEJCQVx1NjU4NycsICdcdThCQkVcdThCQTEnLCAnXHU2NENEXHU0RjVDJ11bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSldLFxuICBkZXBhcnRtZW50OiBbJ1x1OEJBMVx1N0I5N1x1NjczQVx1NUI2Nlx1OTY2MicsICdcdTY3M0FcdTY4QjBcdTVCNjZcdTk2NjInLCAnXHU3NTM1XHU1QjUwXHU0RkUxXHU2MDZGXHU1QjY2XHU5NjYyJywgJ1x1NTkxNlx1NTZGRFx1OEJFRFx1NUI2Nlx1OTY2MiddW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpXSxcbiAgc3RhdHVzOiBNYXRoLnJhbmRvbSgpID4gMC4yID8gMSA6IDAsXG4gIGNyZWF0ZVRpbWU6IE1vY2suUmFuZG9tLmRhdGV0aW1lKCd5eXl5LU1NLWRkIEhIOm1tOnNzJylcbn0pKTtcblxuLy8gXHU2REZCXHU1MkEwXHU4QkZFXHU3QTBCXHU3NkY4XHU1MTczbW9ja1x1NjNBNVx1NTNFM1xuY29uc3QgY291cnNlQXBpczogTW9ja01ldGhvZFtdID0gW1xuICAvLyBcdTgzQjdcdTUzRDZcdThCRkVcdTdBMEJcdTUyMTdcdTg4NjhcbiAge1xuICAgIHVybDogJy9hcGkvY291cnNlL2xpc3QnLFxuICAgIG1ldGhvZDogJ2dldCcsXG4gICAgcmVzcG9uc2U6ICh7IHF1ZXJ5IH0pID0+IHtcbiAgICAgIGNvbnN0IHsgcGFnZVNpemUgPSAxMCwgcGFnZUluZGV4ID0gMSwgbmFtZSA9ICcnLCBjb2RlID0gJycsIGNhdGVnb3J5ID0gJycsIG5hdHVyZSA9ICcnLCBkZXBhcnRtZW50ID0gJycsIHNvcnQgPSAnJywgb3JkZXIgPSAnJyB9ID0gcXVlcnk7XG4gICAgICBcbiAgICAgIGxldCBmaWx0ZXJlZExpc3QgPSBbLi4uY291cnNlTW9ja0xpc3RdO1xuICAgICAgXG4gICAgICAvLyBcdTdCNUJcdTkwMDlcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIGZpbHRlcmVkTGlzdCA9IGZpbHRlcmVkTGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLm5hbWUuaW5jbHVkZXMobmFtZSkpO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGUpIHtcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uY29kZS5pbmNsdWRlcyhjb2RlKSk7XG4gICAgICB9XG4gICAgICBpZiAoY2F0ZWdvcnkpIHtcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uY2F0ZWdvcnkgPT09IGNhdGVnb3J5KTtcbiAgICAgIH1cbiAgICAgIGlmIChuYXR1cmUpIHtcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0ubmF0dXJlID09PSBuYXR1cmUpO1xuICAgICAgfVxuICAgICAgaWYgKGRlcGFydG1lbnQpIHtcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uZGVwYXJ0bWVudCA9PT0gZGVwYXJ0bWVudCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFx1NjM5Mlx1NUU4RlxuICAgICAgaWYgKHNvcnQgJiYgb3JkZXIpIHtcbiAgICAgICAgZmlsdGVyZWRMaXN0LnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICBjb25zdCBzb3J0RmllbGQgPSBzb3J0IGFzIGtleW9mIHR5cGVvZiBhO1xuICAgICAgICAgIGlmIChvcmRlciA9PT0gJ2Rlc2MnKSB7XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKGJbc29ydEZpZWxkXSkubG9jYWxlQ29tcGFyZShTdHJpbmcoYVtzb3J0RmllbGRdKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcoYVtzb3J0RmllbGRdKS5sb2NhbGVDb21wYXJlKFN0cmluZyhiW3NvcnRGaWVsZF0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBcdTUyMDZcdTk4NzVcbiAgICAgIGNvbnN0IHN0YXJ0ID0gKHBhZ2VJbmRleCAtIDEpICogcGFnZVNpemU7XG4gICAgICBjb25zdCBlbmQgPSBwYWdlSW5kZXggKiBwYWdlU2l6ZTtcbiAgICAgIGNvbnN0IGxpc3QgPSBmaWx0ZXJlZExpc3Quc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgICBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBsaXN0LFxuICAgICAgICAgIHRvdGFsOiBmaWx0ZXJlZExpc3QubGVuZ3RoLFxuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlOiAnb2snLFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuICBcbiAgLy8gXHU2REZCXHU1MkEwXHU4QkZFXHU3QTBCXG4gIHtcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS9hZGQnLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH0pID0+IHtcbiAgICAgIGNvbnN0IHsgY29kZSwgbmFtZSB9ID0gYm9keTtcbiAgICAgIFxuICAgICAgLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4XG4gICAgICBjb25zdCBleGlzdGluZ0NvdXJzZSA9IGNvdXJzZU1vY2tMaXN0LmZpbmQoaXRlbSA9PiBpdGVtLmNvZGUgPT09IGNvZGUpO1xuICAgICAgaWYgKGV4aXN0aW5nQ291cnNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29kZTogMSxcbiAgICAgICAgICBtZXNzYWdlOiAnXHU4QkZFXHU3QTBCXHU0RUUzXHU3ODAxXHU1REYyXHU1QjU4XHU1NzI4JyxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gXHU2NUIwXHU1ODlFXG4gICAgICBjb25zdCBuZXdJZCA9IGNvdXJzZU1vY2tMaXN0Lmxlbmd0aCA+IDAgPyBNYXRoLm1heCguLi5jb3Vyc2VNb2NrTGlzdC5tYXAoaXRlbSA9PiBwYXJzZUludChpdGVtLmlkIGFzIHN0cmluZywgMTApKSkgKyAxIDogMTtcbiAgICAgIGNvbnN0IG5ld0NvdXJzZSA9IHtcbiAgICAgICAgaWQ6IG5ld0lkLnRvU3RyaW5nKCksXG4gICAgICAgIC4uLmJvZHksXG4gICAgICAgIHRvdGFsSG91cnM6IChib2R5LnRoZW9yeUhvdXJzIHx8IDApICsgKGJvZHkucHJhY3RpY2VIb3VycyB8fCAwKSxcbiAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSksXG4gICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKCdUJywgJyAnKS5zdWJzdHJpbmcoMCwgMTkpLFxuICAgICAgfTtcbiAgICAgIFxuICAgICAgY291cnNlTW9ja0xpc3QudW5zaGlmdChuZXdDb3Vyc2UpO1xuICAgICAgXG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiAwLFxuICAgICAgICBkYXRhOiBuZXdDb3Vyc2UsXG4gICAgICAgIG1lc3NhZ2U6ICdcdTZERkJcdTUyQTBcdTYyMTBcdTUyOUYnLFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuXG4gIC8vIFx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFx1OEJGRVx1N0EwQlx1NEVFM1x1NzgwMVxuICB7XG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UvZ2VuZXJhdGUtY29kZScsXG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgcmVzcG9uc2U6ICh7IGJvZHkgfSkgPT4ge1xuICAgICAgY29uc3QgeyBjYXRlZ29yeSwgbmF0dXJlLCBkZXBhcnRtZW50IH0gPSBib2R5O1xuICAgICAgXG4gICAgICAvLyBcdTY4MzlcdTYzNkVcdTYzRDBcdTRGOUJcdTc2ODRcdTRGRTFcdTYwNkZcdUZGMENcdTc1MUZcdTYyMTBcdThCRkVcdTdBMEJcdTRFRTNcdTc4MDFcbiAgICAgIGNvbnN0IGNhdGVnb3J5UHJlZml4ID0gY2F0ZWdvcnkgPyBjYXRlZ29yeS5jaGFyQXQoMCkgOiAnQyc7XG4gICAgICBjb25zdCBuYXR1cmVDb2RlID0gbmF0dXJlID09PSAncmVxdWlyZWQnID8gJ0InIDogKG5hdHVyZSA9PT0gJ2VsZWN0aXZlJyA/ICdYJyA6ICdMJyk7XG4gICAgICBjb25zdCBkZXBhcnRtZW50Q29kZSA9IGRlcGFydG1lbnQgfHwgJzAnO1xuICAgICAgXG4gICAgICAvLyBcdTc1MUZcdTYyMTBcdTRFMDBcdTRFMkFcdTk2OEZcdTY3M0FcdTVFOEZcdTUzRjdcbiAgICAgIGNvbnN0IHJhbmRvbU51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDApLnRvU3RyaW5nKCkucGFkU3RhcnQoMywgJzAnKTtcbiAgICAgIFxuICAgICAgLy8gXHU3RUM0XHU1NDA4XHU0RUUzXHU3ODAxXG4gICAgICBjb25zdCBnZW5lcmF0ZWRDb2RlID0gYCR7Y2F0ZWdvcnlQcmVmaXh9JHtuYXR1cmVDb2RlfSR7ZGVwYXJ0bWVudENvZGV9JHtyYW5kb21OdW19YDtcbiAgICAgIFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGNvZGU6IGdlbmVyYXRlZENvZGVcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NzUxRlx1NjIxMFx1NjIxMFx1NTI5RidcbiAgICAgIH07XG4gICAgfVxuICB9LFxuXG4gIC8vIFx1ODNCN1x1NTNENlx1OEJGRVx1N0EwQlx1OEJFNlx1NjBDNVxuICB7XG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UvZGV0YWlsLzppZCcsXG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICByZXNwb25zZTogKHsgcGFyYW1zIH0pID0+IHtcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHBhcmFtcztcbiAgICAgIGNvbnN0IGNvdXJzZSA9IGNvdXJzZU1vY2tMaXN0LmZpbmQoaXRlbSA9PiBpdGVtLmlkID09PSBpZCk7XG4gICAgICBcbiAgICAgIGlmICghY291cnNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29kZTogMSxcbiAgICAgICAgICBtZXNzYWdlOiAnXHU4QkZFXHU3QTBCXHU0RTBEXHU1QjU4XHU1NzI4JyxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgZGF0YTogY291cnNlLFxuICAgICAgICBtZXNzYWdlOiAnb2snLFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuXTtcblxuLy8gXHU2REZCXHU1MkEwXHU4QkZFXHU3QTBCXHU1QkZDXHU1MTY1XHU1QkZDXHU1MUZBXHU3NkY4XHU1MTczXHU3Njg0bW9ja1x1NjNBNVx1NTNFM1xuY29uc3QgY291cnNlSW1wb3J0RXhwb3J0QXBpczogTW9ja01ldGhvZFtdID0gW1xuICAvLyBcdTRFMEJcdThGN0RcdThCRkVcdTdBMEJcdTVCRkNcdTUxNjVcdTZBMjFcdTY3N0ZcbiAge1xuICAgIHVybDogJy9hcGkvY291cnNlL3RlbXBsYXRlL2Rvd25sb2FkJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiAwLFxuICAgICAgICBtZXNzYWdlOiAnXHU2QTIxXHU2NzdGXHU0RTBCXHU4RjdEXHU2MjEwXHU1MjlGJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHVybDogJ2h0dHA6Ly9leGFtcGxlLmNvbS9jb3Vyc2UtdGVtcGxhdGUueGxzeCcsXG4gICAgICAgICAgZmlsZU5hbWU6ICdjb3Vyc2UtdGVtcGxhdGUueGxzeCcsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIFxuICAvLyBcdTVCRkNcdTUxNjVcdThCRkVcdTdBMEJcbiAge1xuICAgIHVybDogJy9hcGkvY291cnNlL2ltcG9ydCcsXG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgcmVzcG9uc2U6ICh7IGJvZHkgfSkgPT4ge1xuICAgICAgY29uc3QgbW9ja1Jlc3BvbnNlID0ge1xuICAgICAgICBjb2RlOiAwLFxuICAgICAgICBtZXNzYWdlOiAnXHU1QkZDXHU1MTY1XHU2MjEwXHU1MjlGJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHN1Y2Nlc3NDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjApICsgMTAsIC8vIFx1NkEyMVx1NjJERjEwLTMwXHU2NzYxXHU2MjEwXHU1MjlGXHU1QkZDXHU1MTY1XG4gICAgICAgICAgZmFpbENvdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1KSwgLy8gXHU2QTIxXHU2MkRGMC01XHU2NzYxXHU1OTMxXHU4RDI1XG4gICAgICAgICAgZmFpbExpc3Q6IFtdLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIFxuICAgICAgLy8gXHU5NjhGXHU2NzNBXHU3NTFGXHU2MjEwXHU1OTMxXHU4RDI1XHU4QkIwXHU1RjU1XG4gICAgICBpZiAobW9ja1Jlc3BvbnNlLmRhdGEuZmFpbENvdW50ID4gMCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vY2tSZXNwb25zZS5kYXRhLmZhaWxDb3VudDsgaSsrKSB7XG4gICAgICAgICAgbW9ja1Jlc3BvbnNlLmRhdGEuZmFpbExpc3QucHVzaCh7XG4gICAgICAgICAgICByb3dJbmRleDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDEsXG4gICAgICAgICAgICByZWFzb246IFsnXHU4QkZFXHU3QTBCXHU0RUUzXHU3ODAxXHU1REYyXHU1QjU4XHU1NzI4JywgJ1x1OEJGRVx1N0EwQlx1NTQwRFx1NzlGMFx1NEUwRFx1ODBGRFx1NEUzQVx1N0E3QScsICdcdTVCNjZcdTUyMDZcdTY4M0NcdTVGMEZcdTk1MTlcdThCRUYnLCAnXHU1RjAwXHU4QkZFXHU5NjYyXHU3Q0ZCXHU0RTBEXHU1QjU4XHU1NzI4JywgJ1x1OEJGRVx1N0EwQlx1N0M3Qlx1NTIyQlx1NEUwRFx1NUI1OFx1NTcyOCddW1xuICAgICAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1KVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gbW9ja1Jlc3BvbnNlO1xuICAgIH0sXG4gIH0sXG4gIFxuICAvLyBcdTVCRkNcdTUxRkFcdThCRkVcdTdBMEJcdTY1NzBcdTYzNkVcbiAge1xuICAgIHVybDogJy9hcGkvY291cnNlL2V4cG9ydCcsXG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIG1lc3NhZ2U6ICdcdTVCRkNcdTUxRkFcdTYyMTBcdTUyOUYnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdXJsOiAnaHR0cDovL2V4YW1wbGUuY29tL2NvdXJzZXMueGxzeCcsXG4gICAgICAgICAgZmlsZU5hbWU6ICdcdThCRkVcdTdBMEJcdTY1NzBcdTYzNkVfJyArIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCkucmVwbGFjZSgvLS9nLCAnJykgKyAnLnhsc3gnLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuICBcbiAgLy8gXHU1QkZDXHU1MUZBXHU1MjE3XHU4ODY4XHU2NTcwXHU2MzZFXG4gIHtcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS9leHBvcnQtbGlzdCcsXG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgcmVzcG9uc2U6ICh7IGJvZHkgfSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgbWVzc2FnZTogJ1x1NUJGQ1x1NTFGQVx1NjIxMFx1NTI5RicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB1cmw6ICdodHRwOi8vZXhhbXBsZS5jb20vY291cnNlLWxpc3QueGxzeCcsXG4gICAgICAgICAgZmlsZU5hbWU6ICdcdThCRkVcdTdBMEJcdTUyMTdcdTg4NjhfJyArIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCkucmVwbGFjZSgvLS9nLCAnJykgKyAnLnhsc3gnLFxuICAgICAgICAgIHRvdGFsOiBib2R5LnBhZ2VTaXplIHx8IDAsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG5dO1xuXG4vLyBcdTVDMDZcdTUzOUZcdTY3MDlcdTc2ODQgbW9jayBcdTY1QjlcdTZDRDVcdTY1NzBcdTdFQzRcdThENEJcdTUwM0NcdTdFRDlcdTUzRDhcdTkxQ0ZcbmNvbnN0IG9yaWdpbmFsTW9ja01ldGhvZHMgPSBbXG4gIHtcbiAgICB1cmw6ICcvYXBpL2dldC1wdXJjaGFzZS1saXN0JyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAoKSA9PiAoe1xuICAgICAgY29kZTogMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLi4uTW9jay5tb2NrKHtcbiAgICAgICAgICAnbGlzdHwxLTEwMCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaW5kZXg6IC9TMjAyMDEyMjgxMTU5NTBbMC05XVswLTldWzAtOV0vLFxuICAgICAgICAgICAgICBwZE5hbWU6ICdNYWNib29rJyxcbiAgICAgICAgICAgICAgcGROdW06ICdwX3RtcF82MGE2MzdjZDBkJyxcbiAgICAgICAgICAgICAgJ3B1cmNoYXNlTnVtfDEtMTAwJzogMTAwLFxuICAgICAgICAgICAgICBhZG1pbk5hbWU6ICdcdThEMjJcdTUyQTFcdTkwRTgxMTEnLFxuICAgICAgICAgICAgICB1cGRhdGVUaW1lOiAnMjAyMC0wNS0yMEBkYXRlKFwiSEg6bW06c3NcIiknLFxuICAgICAgICAgICAgICBwZFR5cGU6ICdcdTc1MzVcdTVCNTBcdTRFQTdcdTU0QzEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaW5kZXg6IC9TMjAyMDEyMjgxMTU5NTBbMC05XVswLTldWzAtOV0vLFxuICAgICAgICAgICAgICBwZE5hbWU6ICdNYWNib29rJyxcbiAgICAgICAgICAgICAgcGROdW06ICdwX3RtcF82MGE2MzdjZDBkJyxcbiAgICAgICAgICAgICAgJ3B1cmNoYXNlTnVtfDEtMTAwJzogMTAwLFxuICAgICAgICAgICAgICBhZG1pbk5hbWU6ICdcdThEMjJcdTUyQTFcdTkwRTgnLFxuICAgICAgICAgICAgICB1cGRhdGVUaW1lOiAnMjAyMC0wNS0yMEBkYXRlKFwiSEg6bW06c3NcIiknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSksXG4gIH0sXG4gIHtcbiAgICB1cmw6ICcvYXBpL2dldC1saXN0JyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAoKSA9PiAoe1xuICAgICAgY29kZTogMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLi4uTW9jay5tb2NrKHtcbiAgICAgICAgICAnbGlzdHwxLTEwMCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ2luZGV4fCsxJzogMSxcbiAgICAgICAgICAgICAgJ3N0YXR1c3wxJzogJ0BuYXR1cmFsKDAsIDQpJyxcbiAgICAgICAgICAgICAgbm86ICdCSDAwQG5hdHVyYWwoMDEsIDEwMCknLFxuICAgICAgICAgICAgICBuYW1lOiAnQGNpdHkoKVx1NTI5RVx1NTE2Q1x1NzUyOFx1NTRDMVx1OTFDN1x1OEQyRFx1OTg3OVx1NzZFRScsXG4gICAgICAgICAgICAgICdwYXltZW50VHlwZXwxJzogJ0BuYXR1cmFsKDAsIDEpJyxcbiAgICAgICAgICAgICAgJ2NvbnRyYWN0VHlwZXwxJzogJ0BuYXR1cmFsKDAsIDIpJyxcbiAgICAgICAgICAgICAgdXBkYXRlVGltZTogJzIwMjAtMDUtMzAgQGRhdGUoXCJISDptbTpzc1wiKScsXG4gICAgICAgICAgICAgIGFtb3VudDogJ0BuYXR1cmFsKDEwLCA1MDApLDAwMCwwMDAnLFxuICAgICAgICAgICAgICBhZG1pbk5hbWU6ICdAY25hbWUoKScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICB9KSxcbiAgfSxcbiAge1xuICAgIHVybDogJy9hcGkvZGV0YWlsLWJhc2ljJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAoKSA9PiAoe1xuICAgICAgY29kZTogMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLi4uTW9jay5tb2NrKHtcbiAgICAgICAgICBuYW1lOiAndGRfMjAwMjM3NDcnLFxuICAgICAgICAgIGxvZ2luVHlwZTogJ1dlYicsXG4gICAgICAgICAgY3VycmVudFJvbGU6ICdBZG1pbicsXG4gICAgICAgICAgcmlnaHRzTGlzdDogJ1x1OTAxQVx1NzUyOFx1Njc0M1x1OTY1MCcsXG4gICAgICAgICAgdXNlclN0YXR1czogJ1x1NTQyRlx1NzUyOCcsXG4gICAgICAgICAgbGFuZ3VhZ2U6ICdcdTdCODBcdTRGNTNcdTRFMkRcdTY1ODcnLFxuICAgICAgICAgIHRpbWVab25lOiAnKEdNVCswODowMClcdTRFMkRcdTU2RkRcdTY1RjZcdTUzM0FcdTIwMTRcdTUzMTdcdTRFQUNcdUZGMDhBc2lhL0JlaWppbmdcdUZGMDknLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSksXG4gIH0sXG4gIHtcbiAgICB1cmw6ICcvYXBpL2dldC1jYXJkLWxpc3QnLFxuICAgIG1ldGhvZDogJ2dldCcsXG4gICAgcmVzcG9uc2U6ICgpID0+ICh7XG4gICAgICBjb2RlOiAwLFxuICAgICAgZGF0YToge1xuICAgICAgICAuLi5Nb2NrLm1vY2soe1xuICAgICAgICAgICdsaXN0fDQ4LTUwJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnaW5kZXh8KzEnOiAxLFxuICAgICAgICAgICAgICBpc1NldHVwOiAnQGJvb2xlYW4nLFxuICAgICAgICAgICAgICAndHlwZXwxJzogJ0BuYXR1cmFsKDEsIDUpJyxcbiAgICAgICAgICAgICAgJ2Jhbm5lcnwxJzogW1xuICAgICAgICAgICAgICAgICdodHRwczovL3RkZXNpZ24uZ3RpbWcuY29tL3N0YXJ0ZXIvY2xvdWQtZGIuanBnJyxcbiAgICAgICAgICAgICAgICAnaHR0cHM6Ly90ZGVzaWduLmd0aW1nLmNvbS9zdGFydGVyL2Nsb3VkLXNlcnZlci5qcGcnLFxuICAgICAgICAgICAgICAgICdodHRwczovL3RkZXNpZ24uZ3RpbWcuY29tL3N0YXJ0ZXIvc3NsLmpwZycsXG4gICAgICAgICAgICAgICAgJ2h0dHBzOi8vdGRlc2lnbi5ndGltZy5jb20vc3RhcnRlci90LXNlYy5qcGcnLFxuICAgICAgICAgICAgICAgICdodHRwczovL3RkZXNpZ24uZ3RpbWcuY29tL3N0YXJ0ZXIvZmFjZS1yZWNvZ25pdGlvbi5qcGcnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnbmFtZXwxJzogWydcdTRFQkFcdTgxMzhcdThCQzZcdTUyMkInLCAnU1NMXHU4QkMxXHU0RTY2JywgJ0NWTScsICdcdTRFOTFcdTY1NzBcdTYzNkVcdTVFOTMnLCAnVC1TZWMgXHU0RTkxXHU5NjMyXHU3MDZCXHU1ODk5J10sXG4gICAgICAgICAgICAgICdkZXNjcmlwdGlvbnwxJzogW1xuICAgICAgICAgICAgICAgICdcdTU3RkFcdTRFOEVcdTgxN0VcdThCQUZcdTRGMThcdTU2RkVcdTVGM0FcdTU5MjdcdTc2ODRcdTk3NjJcdTkwRThcdTUyMDZcdTY3OTBcdTYyODBcdTY3MkZcdUZGMENcdTYzRDBcdTRGOUJcdTUzMDVcdTYyRUNcdTRFQkFcdTgxMzhcdTY4QzBcdTZENEJcdTRFMEVcdTUyMDZcdTY3OTBcdTMwMDFcdTRFOTRcdTVCOThcdTVCOUFcdTRGNERcdTMwMDFcdTRFQkFcdTgxMzhcdTY0MUNcdTdEMjJcdTMwMDFcdTRFQkFcdTgxMzhcdTZCRDRcdTVCRjlcdTMwMDFcdTRFQkFcdTgxMzgnLFxuICAgICAgICAgICAgICAgICdcdTRFOTFcdTc4NkNcdTc2RDhcdTRFM0FcdTYwQThcdTYzRDBcdTRGOUJcdTc1MjhcdTRFOEVDVk1cdTc2ODRcdTYzMDFcdTRFNDVcdTYwMjdcdTY1NzBcdTYzNkVcdTU3NTdcdTdFQTdcdTVCNThcdTUwQThcdTY3MERcdTUyQTFcdTMwMDJcdTRFOTFcdTc4NkNcdTc2RDhcdTRFMkRcdTc2ODRcdTY1NzBcdTYzNkVcdTgxRUFcdTUyQThcdTU3MzBcdTUzRUZcdTc1MjhcdTUzM0FcdTUxODVcdTRFRTVcdTU5MUFcdTUyNkZcdTY3MkNcdTUxOTcnLFxuICAgICAgICAgICAgICAgICdTU0xcdThCQzFcdTRFNjZcdTUzQzhcdTUzRUJcdTY3MERcdTUyQTFcdTU2NjhcdThCQzFcdTRFNjZcdUZGMENcdTgxN0VcdThCQUZcdTRFOTFcdTRFM0FcdTYwQThcdTYzRDBcdTRGOUJcdThCQzFcdTRFNjZcdTc2ODRcdTRFMDBcdTdBRDlcdTVGMEZcdTY3MERcdTUyQTFcdUZGMENcdTUzMDVcdTYyRUNcdTUxNERcdThEMzlcdTMwMDFcdTRFRDhcdThEMzlcdThCQzFcdTRFNjZcdTc2ODRcdTc1MzNcdThCRjdcdTMwMDFcdTdCQTFcdTc0MDZcdTUzQ0FcdTkwRTgnLFxuICAgICAgICAgICAgICAgICdcdTgxN0VcdThCQUZcdTVCODlcdTUxNjhcdTRFOTFcdTk2MzJcdTcwNkJcdTU4OTlcdTRFQTdcdTU0QzFcdUZGMENcdTY2MkZcdTgxN0VcdThCQUZcdTRFOTFcdTVCODlcdTUxNjhcdTU2RTJcdTk2MUZcdTdFRDNcdTU0MDhcdTRFOTFcdTUzOUZcdTc1MUZcdTc2ODRcdTRGMThcdTUyQkZcdUZGMENcdTgxRUFcdTRFM0JcdTc4MTRcdTUzRDFcdTc2ODRTYWFTXHU1MzE2XHU5NjMyXHU3MDZCXHU1ODk5XHU0RUE3XHU1NEMxXHVGRjBDXHU2NUUwXHU5NzAwXHU1QkEyXHU2NUUwXHU5NzAwXHU1QkEyXHU2NUUwXHU5NzAwXHU1QkEyXHU2NUUwXHU5NzAwXHU1QkEyXHU2NUUwXHU5NzAwXHU1QkEyXHU2NUUwXHU5NzAwXHU1QkEyXHU2NUUwXHU5NzAwXHU1QkEyJyxcbiAgICAgICAgICAgICAgICAnXHU0RTkxXHU2NTcwXHU2MzZFXHU1RTkzTXlTUUxcdTRFM0FcdTc1MjhcdTYyMzdcdTYzRDBcdTRGOUJcdTVCODlcdTUxNjhcdTUzRUZcdTk3NjBcdUZGMENcdTYwMjdcdTgwRkRcdTUzNTNcdThEOEFcdTMwMDFcdTY2MTNcdTRFOEVcdTdFRjRcdTYyQTRcdTc2ODRcdTRGMDFcdTRFMUFcdTdFQTdcdTRFOTFcdTY1NzBcdTYzNkVcdTVFOTNcdTY3MERcdTUyQTFcdTMwMDInLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSksXG4gIH0sXG4gIHtcbiAgICB1cmw6ICcvYXBpL2dldC1wcm9qZWN0LWxpc3QnLFxuICAgIG1ldGhvZDogJ2dldCcsXG4gICAgcmVzcG9uc2U6ICgpID0+ICh7XG4gICAgICBjb2RlOiAwLFxuICAgICAgZGF0YToge1xuICAgICAgICAuLi5Nb2NrLm1vY2soe1xuICAgICAgICAgICdsaXN0fDEtNTAnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdpbmRleHwrMSc6IDEsXG4gICAgICAgICAgICAgIGFkbWluUGhvbmU6ICcrODYgMTM1ODc2MDk5NTUnLFxuICAgICAgICAgICAgICB1cGRhdGVUaW1lOiAnMjAyMC0wNS0zMCBAZGF0ZShcIkhIOm1tOnNzXCIpJyxcbiAgICAgICAgICAgICAgJ2FkbWluTmFtZXwxJzogWydcdTk4N0VcdTVBMUZcdCcsICdcdTVFMzhcdTUyMUEnLCAnXHU5MEQxXHU2RDBCJ10sXG4gICAgICAgICAgICAgICduYW1lfDEnOiBbXG4gICAgICAgICAgICAgICAgJ1x1NkNBN1x1NURERVx1NUUwMlx1NTI5RVx1NTE2Q1x1NzUyOFx1NTRDMVx1OTFDN1x1OEQyRFx1OTg3OVx1NzZFRScsXG4gICAgICAgICAgICAgICAgJ1x1N0VBMlx1NkNCM1x1NTRDOFx1NUMzQ1x1NjVDRlx1NUY1RFx1NjVDRlx1ODFFQVx1NkNCQlx1NURERVx1NTI5RVx1NTE2Q1x1NzUyOFx1NTRDMVx1OTFDN1x1OEQyRFx1OTg3OVx1NzZFRVx0JyxcbiAgICAgICAgICAgICAgICAnXHU5NERDXHU1REREXHU1RTAyXHU1MjlFXHU1MTZDXHU3NTI4XHU1NEMxXHU5MUM3XHU4RDJEXHU5ODc5XHU3NkVFJyxcbiAgICAgICAgICAgICAgICAnXHU5NjQ3XHU1MzU3XHU1RTAyXHU1MjlFXHU1MTZDXHU3NTI4XHU1NEMxXHU5MUM3XHU4RDJEXHU5ODc5XHU3NkVFXHQnLFxuICAgICAgICAgICAgICAgICdcdTUxNkRcdTVCODlcdTVFMDJcdTUyOUVcdTUxNkNcdTc1MjhcdTU0QzFcdTkxQzdcdThEMkRcdTk4NzlcdTc2RUVcdCAnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSksXG4gIH0sXG4gIHtcbiAgICB1cmw6ICcvYXBpL3Bvc3QnLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIHRpbWVvdXQ6IDIwMDAsXG4gICAgcmVzcG9uc2U6IHtcbiAgICAgIGNvZGU6IDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG5hbWU6ICd2YmVuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHVybDogJy9hcGkvZ2V0LW1lbnUtbGlzdC1pMThuJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHRpbWVvdXQ6IDIwMDAsXG4gICAgcmVzcG9uc2U6IHtcbiAgICAgIGNvZGU6IDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIC4uLk1vY2subW9jayh7XG4gICAgICAgICAgbGlzdDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwYXRoOiAnL2xpc3QnLFxuICAgICAgICAgICAgICBuYW1lOiAnbGlzdCcsXG4gICAgICAgICAgICAgIGNvbXBvbmVudDogJ0xBWU9VVCcsXG4gICAgICAgICAgICAgIHJlZGlyZWN0OiAnL2xpc3QvYmFzZScsXG4gICAgICAgICAgICAgIG1ldGE6IHtcbiAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgemhfQ046ICdcdTUyMTdcdTg4NjhcdTk4NzUnLFxuICAgICAgICAgICAgICAgICAgZW5fVVM6ICdMaXN0JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGljb246ICd2aWV3LWxpc3QnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHBhdGg6ICdiYXNlJyxcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICdMaXN0QmFzZScsXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICcvbGlzdC9iYXNlL2luZGV4JyxcbiAgICAgICAgICAgICAgICAgIG1ldGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICB6aF9DTjogJ1x1NTdGQVx1Nzg0MFx1NTIxN1x1ODg2OFx1OTg3NScsXG4gICAgICAgICAgICAgICAgICAgICAgZW5fVVM6ICdCYXNlIExpc3QnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHBhdGg6ICdjYXJkJyxcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICdMaXN0Q2FyZCcsXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICcvbGlzdC9jYXJkL2luZGV4JyxcbiAgICAgICAgICAgICAgICAgIG1ldGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICB6aF9DTjogJ1x1NTM2MVx1NzI0N1x1NTIxN1x1ODg2OFx1OTg3NScsXG4gICAgICAgICAgICAgICAgICAgICAgZW5fVVM6ICdDYXJkIExpc3QnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHBhdGg6ICdmaWx0ZXInLFxuICAgICAgICAgICAgICAgICAgbmFtZTogJ0xpc3RGaWx0ZXInLFxuICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiAnL2xpc3QvZmlsdGVyL2luZGV4JyxcbiAgICAgICAgICAgICAgICAgIG1ldGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICB6aF9DTjogJ1x1N0I1Qlx1OTAwOVx1NTIxN1x1ODg2OFx1OTg3NScsXG4gICAgICAgICAgICAgICAgICAgICAgZW5fVVM6ICdGaWx0ZXIgTGlzdCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcGF0aDogJ3RyZWUnLFxuICAgICAgICAgICAgICAgICAgbmFtZTogJ0xpc3RUcmVlJyxcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDogJy9saXN0L3RyZWUvaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgbWV0YToge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgIHpoX0NOOiAnXHU2ODExXHU3MkI2XHU3QjVCXHU5MDA5XHU1MjE3XHU4ODY4XHU5ODc1JyxcbiAgICAgICAgICAgICAgICAgICAgICBlbl9VUzogJ1RyZWUgTGlzdCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwYXRoOiAnL2Zvcm0nLFxuICAgICAgICAgICAgICBuYW1lOiAnZm9ybScsXG4gICAgICAgICAgICAgIGNvbXBvbmVudDogJ0xBWU9VVCcsXG4gICAgICAgICAgICAgIHJlZGlyZWN0OiAnL2Zvcm0vYmFzZScsXG4gICAgICAgICAgICAgIG1ldGE6IHtcbiAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgemhfQ046ICdcdTg4NjhcdTUzNTVcdTk4NzUnLFxuICAgICAgICAgICAgICAgICAgZW5fVVM6ICdGb3JtJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGljb246ICdlZGl0LTEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHBhdGg6ICdiYXNlJyxcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICdGb3JtQmFzZScsXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICcvZm9ybS9iYXNlL2luZGV4JyxcbiAgICAgICAgICAgICAgICAgIG1ldGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICB6aF9DTjogJ1x1NTdGQVx1Nzg0MFx1ODg2OFx1NTM1NVx1OTg3NScsXG4gICAgICAgICAgICAgICAgICAgICAgZW5fVVM6ICdCYXNlIEZvcm0nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHBhdGg6ICdzdGVwJyxcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICdGb3JtU3RlcCcsXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICcvZm9ybS9zdGVwL2luZGV4JyxcbiAgICAgICAgICAgICAgICAgIG1ldGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICB6aF9DTjogJ1x1NTIwNlx1NkI2NVx1ODg2OFx1NTM1NVx1OTg3NScsXG4gICAgICAgICAgICAgICAgICAgICAgZW5fVVM6ICdTdGVwIEZvcm0nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcGF0aDogJy9kZXRhaWwnLFxuICAgICAgICAgICAgICBuYW1lOiAnZGV0YWlsJyxcbiAgICAgICAgICAgICAgY29tcG9uZW50OiAnTEFZT1VUJyxcbiAgICAgICAgICAgICAgcmVkaXJlY3Q6ICcvZGV0YWlsL2Jhc2UnLFxuICAgICAgICAgICAgICBtZXRhOiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgIHpoX0NOOiAnXHU4QkU2XHU2MEM1XHU5ODc1JyxcbiAgICAgICAgICAgICAgICAgIGVuX1VTOiAnRGV0YWlsJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGljb246ICdsYXllcnMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHBhdGg6ICdiYXNlJyxcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICdEZXRhaWxCYXNlJyxcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDogJy9kZXRhaWwvYmFzZS9pbmRleCcsXG4gICAgICAgICAgICAgICAgICBtZXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgemhfQ046ICdcdTU3RkFcdTc4NDBcdThCRTZcdTYwQzVcdTk4NzUnLFxuICAgICAgICAgICAgICAgICAgICAgIGVuX1VTOiAnQmFzZSBEZXRhaWwnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHBhdGg6ICdhZHZhbmNlZCcsXG4gICAgICAgICAgICAgICAgICBuYW1lOiAnRGV0YWlsQWR2YW5jZWQnLFxuICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiAnL2RldGFpbC9hZHZhbmNlZC9pbmRleCcsXG4gICAgICAgICAgICAgICAgICBtZXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgemhfQ046ICdcdTU5MUFcdTUzNjFcdTcyNDdcdThCRTZcdTYwQzVcdTk4NzUnLFxuICAgICAgICAgICAgICAgICAgICAgIGVuX1VTOiAnQ2FyZCBEZXRhaWwnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHBhdGg6ICdkZXBsb3knLFxuICAgICAgICAgICAgICAgICAgbmFtZTogJ0RldGFpbERlcGxveScsXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICcvZGV0YWlsL2RlcGxveS9pbmRleCcsXG4gICAgICAgICAgICAgICAgICBtZXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgemhfQ046ICdcdTY1NzBcdTYzNkVcdThCRTZcdTYwQzVcdTk4NzUnLFxuICAgICAgICAgICAgICAgICAgICAgIGVuX1VTOiAnRGF0YSBEZXRhaWwnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHBhdGg6ICdzZWNvbmRhcnknLFxuICAgICAgICAgICAgICAgICAgbmFtZTogJ0RldGFpbFNlY29uZGFyeScsXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICcvZGV0YWlsL3NlY29uZGFyeS9pbmRleCcsXG4gICAgICAgICAgICAgICAgICBtZXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgemhfQ046ICdcdTRFOENcdTdFQTdcdThCRTZcdTYwQzVcdTk4NzUnLFxuICAgICAgICAgICAgICAgICAgICAgIGVuX1VTOiAnU2Vjb25kYXJ5IERldGFpbCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwYXRoOiAnL2ZyYW1lJyxcbiAgICAgICAgICAgICAgbmFtZTogJ0ZyYW1lJyxcbiAgICAgICAgICAgICAgY29tcG9uZW50OiAnTGF5b3V0JyxcbiAgICAgICAgICAgICAgcmVkaXJlY3Q6ICcvZnJhbWUvZG9jJyxcbiAgICAgICAgICAgICAgbWV0YToge1xuICAgICAgICAgICAgICAgIGljb246ICdpbnRlcm5ldCcsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICAgIHpoX0NOOiAnXHU1OTE2XHU5MEU4XHU5ODc1XHU5NzYyJyxcbiAgICAgICAgICAgICAgICAgIGVuX1VTOiAnRXh0ZXJuYWwnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcGF0aDogJ2RvYycsXG4gICAgICAgICAgICAgICAgICBuYW1lOiAnRG9jJyxcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDogJ0lGcmFtZScsXG4gICAgICAgICAgICAgICAgICBtZXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGZyYW1lU3JjOiAnaHR0cHM6Ly90ZGVzaWduLnRlbmNlbnQuY29tL3N0YXJ0ZXIvZG9jcy92dWUtbmV4dC9nZXQtc3RhcnRlZCcsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgemhfQ046ICdcdTRGN0ZcdTc1MjhcdTY1ODdcdTY4NjNcdUZGMDhcdTUxODVcdTVENENcdUZGMDknLFxuICAgICAgICAgICAgICAgICAgICAgIGVuX1VTOiAnRG9jdW1lbnRhdGlvbihJRnJhbWUpJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBwYXRoOiAnVERlc2lnbicsXG4gICAgICAgICAgICAgICAgICBuYW1lOiAnVERlc2lnbicsXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICdJRnJhbWUnLFxuICAgICAgICAgICAgICAgICAgbWV0YToge1xuICAgICAgICAgICAgICAgICAgICBmcmFtZVNyYzogJ2h0dHBzOi8vdGRlc2lnbi50ZW5jZW50LmNvbS92dWUtbmV4dC9nZXR0aW5nLXN0YXJ0ZWQnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgIHpoX0NOOiAnVERlc2lnbiBcdTY1ODdcdTY4NjNcdUZGMDhcdTUxODVcdTVENENcdUZGMDknLFxuICAgICAgICAgICAgICAgICAgICAgIGVuX1VTOiAnVERlc2lnbiAoSUZyYW1lKScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcGF0aDogJ1REZXNpZ24yJyxcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICdURGVzaWduMicsXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnQ6ICdJRnJhbWUnLFxuICAgICAgICAgICAgICAgICAgbWV0YToge1xuICAgICAgICAgICAgICAgICAgICBmcmFtZVNyYzogJ2h0dHBzOi8vdGRlc2lnbi50ZW5jZW50LmNvbS92dWUtbmV4dC9nZXR0aW5nLXN0YXJ0ZWQnLFxuICAgICAgICAgICAgICAgICAgICBmcmFtZUJsYW5rOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICAgIHpoX0NOOiAnVERlc2lnbiBcdTY1ODdcdTY4NjNcdUZGMDhcdTU5MTZcdTk0RkUnLFxuICAgICAgICAgICAgICAgICAgICAgIGVuX1VTOiAnVERlc2lnbiBEb2MoTGluayknLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgLy8gXHU1N0ZBXHU3ODQwXHU2NTcwXHU2MzZFLVx1N0VGNFx1NjJBNFxuICB7XG4gICAgdXJsOiAnL2FwaS9zeXN0ZW0vYmFzaWMtZGF0YS9tYWludGVuYW5jZS9saXN0JyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAoKSA9PiAoe1xuICAgICAgY29kZTogMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgY29tbW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgICAgIHR5cGU6ICdjb21tb24nLFxuICAgICAgICAgICAgY29kZTogJ1NFWCcsXG4gICAgICAgICAgICBuYW1lOiAnXHU2MDI3XHU1MjJCJyxcbiAgICAgICAgICAgIHZhbHVlOiAne1wibWFsZVwiOlwiXHU3NTM3XCIsXCJmZW1hbGVcIjpcIlx1NTk3M1wifScsXG4gICAgICAgICAgICBzb3J0OiAxLFxuICAgICAgICAgICAgcmVtYXJrOiAnXHU3NTI4XHU2MjM3XHU2MDI3XHU1MjJCXHU5MDA5XHU5ODc5JyxcbiAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgY3JlYXRlVGltZTogJzIwMjMtMDEtMTUgMDg6MzA6MDAnLFxuICAgICAgICAgICAgdXBkYXRlVGltZTogJzIwMjMtMDMtMjAgMTQ6MjI6MzAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICcyJyxcbiAgICAgICAgICAgIHR5cGU6ICdjb21tb24nLFxuICAgICAgICAgICAgY29kZTogJ1NUQVRVUycsXG4gICAgICAgICAgICBuYW1lOiAnXHU3MkI2XHU2MDAxJyxcbiAgICAgICAgICAgIHZhbHVlOiAne1wiMFwiOlwiXHU3OTgxXHU3NTI4XCIsXCIxXCI6XCJcdTU0MkZcdTc1MjhcIn0nLFxuICAgICAgICAgICAgc29ydDogMixcbiAgICAgICAgICAgIHJlbWFyazogJ1x1OTAxQVx1NzUyOFx1NzJCNlx1NjAwMVx1OTAwOVx1OTg3OScsXG4gICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNyZWF0ZVRpbWU6ICcyMDIzLTAxLTE2IDEwOjIwOjAwJyxcbiAgICAgICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAyLTI4IDExOjMwOjQ1JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBhY2FkZW1pYzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnMycsXG4gICAgICAgICAgICB0eXBlOiAnYWNhZGVtaWMnLFxuICAgICAgICAgICAgY29kZTogJ0RFR1JFRScsXG4gICAgICAgICAgICBuYW1lOiAnXHU1QjY2XHU0RjREJyxcbiAgICAgICAgICAgIHZhbHVlOiAne1wiYmFjaGVsb3JcIjpcIlx1NUI2Nlx1NThFQlwiLFwibWFzdGVyXCI6XCJcdTc4NTVcdTU4RUJcIixcImRvY3RvclwiOlwiXHU1MzVBXHU1OEVCXCJ9JyxcbiAgICAgICAgICAgIHNvcnQ6IDEsXG4gICAgICAgICAgICByZW1hcms6ICdcdTVCNjZcdTRGNERcdTdDN0JcdTU3OEInLFxuICAgICAgICAgICAgaXNBY3RpdmU6IHRydWUsXG4gICAgICAgICAgICBjcmVhdGVUaW1lOiAnMjAyMy0wMS0xOCAxMzo0NTowMCcsXG4gICAgICAgICAgICB1cGRhdGVUaW1lOiAnMjAyMy0wMy0xNSAxNjo0MjoxMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgc3lzdGVtOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICc0JyxcbiAgICAgICAgICAgIHR5cGU6ICdzeXN0ZW0nLFxuICAgICAgICAgICAgY29kZTogJ1VTRVJfVFlQRScsXG4gICAgICAgICAgICBuYW1lOiAnXHU3NTI4XHU2MjM3XHU3QzdCXHU1NzhCJyxcbiAgICAgICAgICAgIHZhbHVlOiAne1wiYWRtaW5cIjpcIlx1N0JBMVx1NzQwNlx1NTQ1OFwiLFwidGVhY2hlclwiOlwiXHU2NTU5XHU1RTA4XCIsXCJzdHVkZW50XCI6XCJcdTVCNjZcdTc1MUZcIn0nLFxuICAgICAgICAgICAgc29ydDogMSxcbiAgICAgICAgICAgIHJlbWFyazogJ1x1N0NGQlx1N0VERlx1NzUyOFx1NjIzN1x1N0M3Qlx1NTc4QicsXG4gICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNyZWF0ZVRpbWU6ICcyMDIzLTAyLTAxIDA5OjIwOjAwJyxcbiAgICAgICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAzLTEwIDA5OjE1OjI1JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnNScsXG4gICAgICAgICAgICB0eXBlOiAnc3lzdGVtJyxcbiAgICAgICAgICAgIGNvZGU6ICdMT0dfVFlQRScsXG4gICAgICAgICAgICBuYW1lOiAnXHU2NUU1XHU1RkQ3XHU3QzdCXHU1NzhCJyxcbiAgICAgICAgICAgIHZhbHVlOiAne1wibG9naW5cIjpcIlx1NzY3Qlx1NUY1NVx1NjVFNVx1NUZEN1wiLFwib3BlcmF0aW9uXCI6XCJcdTY0Q0RcdTRGNUNcdTY1RTVcdTVGRDdcIixcImVycm9yXCI6XCJcdTk1MTlcdThCRUZcdTY1RTVcdTVGRDdcIn0nLFxuICAgICAgICAgICAgc29ydDogMixcbiAgICAgICAgICAgIHJlbWFyazogJ1x1N0NGQlx1N0VERlx1NjVFNVx1NUZEN1x1N0M3Qlx1NTc4QicsXG4gICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgIGNyZWF0ZVRpbWU6ICcyMDIzLTAyLTA1IDExOjMwOjAwJyxcbiAgICAgICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAzLTA1IDEwOjIwOjE1JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KSxcbiAgfSxcbiAgLy8gXHU1N0ZBXHU3ODQwXHU2NTcwXHU2MzZFLVx1N0VGNFx1NjJBNC1cdTZERkJcdTUyQTBcbiAge1xuICAgIHVybDogJy9hcGkvc3lzdGVtL2Jhc2ljLWRhdGEvbWFpbnRlbmFuY2UvYWRkJyxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICByZXNwb25zZTogKHsgYm9keSB9OiB7IGJvZHk6IGFueSB9KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgLi4uYm9keSxcbiAgICAgICAgICBpZDogYCR7RGF0ZS5ub3coKX1gLFxuICAgICAgICAgIGNyZWF0ZVRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKCdUJywgJyAnKS5zdWJzdHJpbmcoMCwgMTkpLFxuICAgICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKCdUJywgJyAnKS5zdWJzdHJpbmcoMCwgMTkpLFxuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlOiAnXHU2REZCXHU1MkEwXHU2MjEwXHU1MjlGJyxcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbiAgLy8gXHU1N0ZBXHU3ODQwXHU2NTcwXHU2MzZFLVx1N0VGNFx1NjJBNC1cdTY2RjRcdTY1QjBcbiAge1xuICAgIHVybDogJy9hcGkvc3lzdGVtL2Jhc2ljLWRhdGEvbWFpbnRlbmFuY2UvdXBkYXRlJyxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICByZXNwb25zZTogKHsgYm9keSB9OiB7IGJvZHk6IGFueSB9KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgLi4uYm9keSxcbiAgICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnVCcsICcgJykuc3Vic3RyaW5nKDAsIDE5KSxcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjZGNFx1NjVCMFx1NjIxMFx1NTI5RicsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIC8vIFx1NTdGQVx1Nzg0MFx1NjU3MFx1NjM2RS1cdTdFRjRcdTYyQTQtXHU1MjIwXHU5NjY0XG4gIHtcbiAgICB1cmw6ICcvYXBpL3N5c3RlbS9iYXNpYy1kYXRhL21haW50ZW5hbmNlL2RlbGV0ZScsXG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIG1lc3NhZ2U6ICdcdTUyMjBcdTk2NjRcdTYyMTBcdTUyOUYnLFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuICBcbiAgLy8gXHU1N0ZBXHU3ODQwXHU2NTcwXHU2MzZFLVx1NUI2Nlx1OTY2Mlx1NEZFMVx1NjA2RlxuICB7XG4gICAgdXJsOiAnL2FwaS9zeXN0ZW0vYmFzaWMtZGF0YS9jb2xsZWdlL2xpc3QnLFxuICAgIG1ldGhvZDogJ2dldCcsXG4gICAgcmVzcG9uc2U6ICgpID0+ICh7XG4gICAgICBjb2RlOiAwLFxuICAgICAgZGF0YTogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgICBjb2RlOiAnQ1MnLFxuICAgICAgICAgIG5hbWU6ICdcdThCQTFcdTdCOTdcdTY3M0FcdTc5RDFcdTVCNjZcdTRFMEVcdTVERTVcdTdBMEJcdTVCNjZcdTk2NjInLFxuICAgICAgICAgIGVuTmFtZTogJ0NvbGxlZ2Ugb2YgQ29tcHV0ZXIgU2NpZW5jZSBhbmQgRW5naW5lZXJpbmcnLFxuICAgICAgICAgIHNob3J0TmFtZTogJ1x1OEJBMVx1N0I5N1x1NjczQVx1NUI2Nlx1OTY2MicsXG4gICAgICAgICAgcGhvbmU6ICcwMTAtMTIzNDU2NzgnLFxuICAgICAgICAgIGVtYWlsOiAnY3NAZXhhbXBsZS5lZHUuY24nLFxuICAgICAgICAgIGZvdW5kVGltZTogJzE5ODUtMDktMDEnLFxuICAgICAgICAgIHNvcnQ6IDEsXG4gICAgICAgICAgc3RhdHVzOiB0cnVlLFxuICAgICAgICAgIHJlbWFyazogJ1x1OEQxRlx1OEQyM1x1OEJBMVx1N0I5N1x1NjczQVx1NzlEMVx1NUI2Nlx1NEUwRVx1NjI4MFx1NjcyRlx1MzAwMVx1OEY2Rlx1NEVGNlx1NURFNVx1N0EwQlx1MzAwMVx1N0Y1MVx1N0VEQ1x1NURFNVx1N0EwQlx1N0I0OVx1NEUxM1x1NEUxQVx1NzY4NFx1NjU1OVx1NUI2Nlx1NEUwRVx1N0JBMVx1NzQwNicsXG4gICAgICAgICAgY3JlYXRlVGltZTogJzIwMjMtMDEtMTUgMDg6MzA6MDAnLFxuICAgICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAzLTIwIDE0OjIyOjMwJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnMicsXG4gICAgICAgICAgY29kZTogJ0VFJyxcbiAgICAgICAgICBuYW1lOiAnXHU3NTM1XHU1QjUwXHU1REU1XHU3QTBCXHU1QjY2XHU5NjYyJyxcbiAgICAgICAgICBlbk5hbWU6ICdDb2xsZWdlIG9mIEVsZWN0cm9uaWMgRW5naW5lZXJpbmcnLFxuICAgICAgICAgIHNob3J0TmFtZTogJ1x1NzUzNVx1NUI1MFx1NUI2Nlx1OTY2MicsXG4gICAgICAgICAgcGhvbmU6ICcwMTAtMTIzNDU2NzknLFxuICAgICAgICAgIGVtYWlsOiAnZWVAZXhhbXBsZS5lZHUuY24nLFxuICAgICAgICAgIGZvdW5kVGltZTogJzE5NzgtMDktMDEnLFxuICAgICAgICAgIHNvcnQ6IDIsXG4gICAgICAgICAgc3RhdHVzOiB0cnVlLFxuICAgICAgICAgIHJlbWFyazogJ1x1OEQxRlx1OEQyM1x1NzUzNVx1NUI1MFx1NEZFMVx1NjA2Rlx1NURFNVx1N0EwQlx1MzAwMVx1OTAxQVx1NEZFMVx1NURFNVx1N0EwQlx1MzAwMVx1NzUzNVx1NUI1MFx1NzlEMVx1NUI2Nlx1NEUwRVx1NjI4MFx1NjcyRlx1N0I0OVx1NEUxM1x1NEUxQVx1NzY4NFx1NjU1OVx1NUI2Nlx1NEUwRVx1N0JBMVx1NzQwNicsXG4gICAgICAgICAgY3JlYXRlVGltZTogJzIwMjMtMDEtMTYgMTA6MjA6MDAnLFxuICAgICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAyLTI4IDExOjMwOjQ1JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnMycsXG4gICAgICAgICAgY29kZTogJ01BJyxcbiAgICAgICAgICBuYW1lOiAnXHU2NTcwXHU1QjY2XHU0RTBFXHU3RURGXHU4QkExXHU1QjY2XHU5NjYyJyxcbiAgICAgICAgICBlbk5hbWU6ICdDb2xsZWdlIG9mIE1hdGhlbWF0aWNzIGFuZCBTdGF0aXN0aWNzJyxcbiAgICAgICAgICBzaG9ydE5hbWU6ICdcdTY1NzBcdTdFREZcdTVCNjZcdTk2NjInLFxuICAgICAgICAgIHBob25lOiAnMDEwLTEyMzQ1NjgwJyxcbiAgICAgICAgICBlbWFpbDogJ21hdGhAZXhhbXBsZS5lZHUuY24nLFxuICAgICAgICAgIGZvdW5kVGltZTogJzE5NTItMDktMDEnLFxuICAgICAgICAgIHNvcnQ6IDMsXG4gICAgICAgICAgc3RhdHVzOiB0cnVlLFxuICAgICAgICAgIHJlbWFyazogJ1x1OEQxRlx1OEQyM1x1NjU3MFx1NUI2Nlx1NEUwRVx1NUU5NFx1NzUyOFx1NjU3MFx1NUI2Nlx1MzAwMVx1N0VERlx1OEJBMVx1NUI2Nlx1MzAwMVx1NjU3MFx1NjM2RVx1NzlEMVx1NUI2Nlx1NEUwRVx1NTkyN1x1NjU3MFx1NjM2RVx1NjI4MFx1NjcyRlx1N0I0OVx1NEUxM1x1NEUxQVx1NzY4NFx1NjU1OVx1NUI2Nlx1NEUwRVx1N0JBMVx1NzQwNicsXG4gICAgICAgICAgY3JlYXRlVGltZTogJzIwMjMtMDEtMTggMTM6NDU6MDAnLFxuICAgICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAzLTE1IDE2OjQyOjEwJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnNCcsXG4gICAgICAgICAgY29kZTogJ01FJyxcbiAgICAgICAgICBuYW1lOiAnXHU2NzNBXHU2OEIwXHU1REU1XHU3QTBCXHU1QjY2XHU5NjYyJyxcbiAgICAgICAgICBlbk5hbWU6ICdDb2xsZWdlIG9mIE1lY2hhbmljYWwgRW5naW5lZXJpbmcnLFxuICAgICAgICAgIHNob3J0TmFtZTogJ1x1NjczQVx1NjhCMFx1NUI2Nlx1OTY2MicsXG4gICAgICAgICAgcGhvbmU6ICcwMTAtMTIzNDU2ODEnLFxuICAgICAgICAgIGVtYWlsOiAnbWVAZXhhbXBsZS5lZHUuY24nLFxuICAgICAgICAgIGZvdW5kVGltZTogJzE5NTUtMDktMDEnLFxuICAgICAgICAgIHNvcnQ6IDQsXG4gICAgICAgICAgc3RhdHVzOiB0cnVlLFxuICAgICAgICAgIHJlbWFyazogJ1x1OEQxRlx1OEQyM1x1NjczQVx1NjhCMFx1OEJCRVx1OEJBMVx1NTIzNlx1OTAyMFx1NTNDQVx1NTE3Nlx1ODFFQVx1NTJBOFx1NTMxNlx1MzAwMVx1NjczQVx1NjhCMFx1NzUzNVx1NUI1MFx1NURFNVx1N0EwQlx1N0I0OVx1NEUxM1x1NEUxQVx1NzY4NFx1NjU1OVx1NUI2Nlx1NEUwRVx1N0JBMVx1NzQwNicsXG4gICAgICAgICAgY3JlYXRlVGltZTogJzIwMjMtMDItMDEgMDk6MjA6MDAnLFxuICAgICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAzLTEwIDA5OjE1OjI1JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnNScsXG4gICAgICAgICAgY29kZTogJ0ZMJyxcbiAgICAgICAgICBuYW1lOiAnXHU1OTE2XHU1NkZEXHU4QkVEXHU1QjY2XHU5NjYyJyxcbiAgICAgICAgICBlbk5hbWU6ICdDb2xsZWdlIG9mIEZvcmVpZ24gTGFuZ3VhZ2VzJyxcbiAgICAgICAgICBzaG9ydE5hbWU6ICdcdTU5MTZcdThCRURcdTVCNjZcdTk2NjInLFxuICAgICAgICAgIHBob25lOiAnMDEwLTEyMzQ1NjgyJyxcbiAgICAgICAgICBlbWFpbDogJ2ZsQGV4YW1wbGUuZWR1LmNuJyxcbiAgICAgICAgICBmb3VuZFRpbWU6ICcxOTYwLTA5LTAxJyxcbiAgICAgICAgICBzb3J0OiA1LFxuICAgICAgICAgIHN0YXR1czogdHJ1ZSxcbiAgICAgICAgICByZW1hcms6ICdcdThEMUZcdThEMjNcdTgyRjFcdThCRURcdTMwMDFcdTY1RTVcdThCRURcdTMwMDFcdTRGQzRcdThCRURcdTdCNDlcdTRFMTNcdTRFMUFcdTc2ODRcdTY1NTlcdTVCNjZcdTRFMEVcdTdCQTFcdTc0MDYnLFxuICAgICAgICAgIGNyZWF0ZVRpbWU6ICcyMDIzLTAyLTA1IDExOjMwOjAwJyxcbiAgICAgICAgICB1cGRhdGVUaW1lOiAnMjAyMy0wMy0wNSAxMDoyMDoxNScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pLFxuICB9LFxuICAvLyBcdTU3RkFcdTc4NDBcdTY1NzBcdTYzNkUtXHU1QjY2XHU5NjYyXHU0RkUxXHU2MDZGLVx1NkRGQlx1NTJBMFxuICB7XG4gICAgdXJsOiAnL2FwaS9zeXN0ZW0vYmFzaWMtZGF0YS9jb2xsZWdlL2FkZCcsXG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgcmVzcG9uc2U6ICh7IGJvZHkgfTogeyBib2R5OiBhbnkgfSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIC4uLmJvZHksXG4gICAgICAgICAgaWQ6IGAke0RhdGUubm93KCl9YCxcbiAgICAgICAgICBjcmVhdGVUaW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnVCcsICcgJykuc3Vic3RyaW5nKDAsIDE5KSxcbiAgICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnVCcsICcgJykuc3Vic3RyaW5nKDAsIDE5KSxcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NkRGQlx1NTJBMFx1NjIxMFx1NTI5RicsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIC8vIFx1NTdGQVx1Nzg0MFx1NjU3MFx1NjM2RS1cdTVCNjZcdTk2NjJcdTRGRTFcdTYwNkYtXHU2NkY0XHU2NUIwXG4gIHtcbiAgICB1cmw6ICcvYXBpL3N5c3RlbS9iYXNpYy1kYXRhL2NvbGxlZ2UvdXBkYXRlJyxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICByZXNwb25zZTogKHsgYm9keSB9OiB7IGJvZHk6IGFueSB9KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgLi4uYm9keSxcbiAgICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnVCcsICcgJykuc3Vic3RyaW5nKDAsIDE5KSxcbiAgICAgICAgfSxcbiAgICAgICAgbWVzc2FnZTogJ1x1NjZGNFx1NjVCMFx1NjIxMFx1NTI5RicsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIC8vIFx1NTdGQVx1Nzg0MFx1NjU3MFx1NjM2RS1cdTVCNjZcdTk2NjJcdTRGRTFcdTYwNkYtXHU1MjIwXHU5NjY0XG4gIHtcbiAgICB1cmw6ICcvYXBpL3N5c3RlbS9iYXNpYy1kYXRhL2NvbGxlZ2UvZGVsZXRlJyxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICByZXNwb25zZTogKCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgbWVzc2FnZTogJ1x1NTIyMFx1OTY2NFx1NjIxMFx1NTI5RicsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIFxuICAvLyBcdTU3RkFcdTc4NDBcdTY1NzBcdTYzNkUtXHU0RTEzXHU0RTFBXHU0RkUxXHU2MDZGXG4gIHtcbiAgICB1cmw6ICcvYXBpL3N5c3RlbS9iYXNpYy1kYXRhL21ham9yL2xpc3QnLFxuICAgIG1ldGhvZDogJ2dldCcsXG4gICAgcmVzcG9uc2U6ICgpID0+ICh7XG4gICAgICBjb2RlOiAwLFxuICAgICAgZGF0YTogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgICBjb2RlOiAnMDgwOTAxJyxcbiAgICAgICAgICBuYW1lOiAnXHU4QkExXHU3Qjk3XHU2NzNBXHU3OUQxXHU1QjY2XHU0RTBFXHU2MjgwXHU2NzJGJyxcbiAgICAgICAgICBlbk5hbWU6ICdDb21wdXRlciBTY2llbmNlIGFuZCBUZWNobm9sb2d5JyxcbiAgICAgICAgICBzaG9ydE5hbWU6ICdcdThCQTFcdTc5RDEnLFxuICAgICAgICAgIGNvbGxlZ2VJZDogJzEnLFxuICAgICAgICAgIHN0dWR5WWVhcnM6ICc0JyxcbiAgICAgICAgICBkZWdyZWVUeXBlOiAnZW5naW5lZXJpbmcnLFxuICAgICAgICAgIGZvdW5kVGltZTogJzE5ODUtMDktMDEnLFxuICAgICAgICAgIHNvcnQ6IDEsXG4gICAgICAgICAgc3RhdHVzOiB0cnVlLFxuICAgICAgICAgIHJlbWFyazogJ1x1OEJBMVx1N0I5N1x1NjczQVx1OTg4Nlx1NTdERlx1NjgzOFx1NUZDM1x1NEUxM1x1NEUxQScsXG4gICAgICAgICAgY3JlYXRlVGltZTogJzIwMjMtMDEtMTUgMDg6MzA6MDAnLFxuICAgICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAzLTIwIDE0OjIyOjMwJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnMicsXG4gICAgICAgICAgY29kZTogJzA4MDkwMicsXG4gICAgICAgICAgbmFtZTogJ1x1OEY2Rlx1NEVGNlx1NURFNVx1N0EwQicsXG4gICAgICAgICAgZW5OYW1lOiAnU29mdHdhcmUgRW5naW5lZXJpbmcnLFxuICAgICAgICAgIHNob3J0TmFtZTogJ1x1OEY2Rlx1NURFNScsXG4gICAgICAgICAgY29sbGVnZUlkOiAnMScsXG4gICAgICAgICAgc3R1ZHlZZWFyczogJzQnLFxuICAgICAgICAgIGRlZ3JlZVR5cGU6ICdlbmdpbmVlcmluZycsXG4gICAgICAgICAgZm91bmRUaW1lOiAnMTk5OC0wOS0wMScsXG4gICAgICAgICAgc29ydDogMixcbiAgICAgICAgICBzdGF0dXM6IHRydWUsXG4gICAgICAgICAgcmVtYXJrOiAnXHU4RjZGXHU0RUY2XHU1RjAwXHU1M0QxXHU0RTBFXHU1REU1XHU3QTBCXHU3QkExXHU3NDA2XHU0RTEzXHU0RTFBJyxcbiAgICAgICAgICBjcmVhdGVUaW1lOiAnMjAyMy0wMS0xNiAxMDoyMDowMCcsXG4gICAgICAgICAgdXBkYXRlVGltZTogJzIwMjMtMDItMjggMTE6MzA6NDUnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICczJyxcbiAgICAgICAgICBjb2RlOiAnMDgwOTAzJyxcbiAgICAgICAgICBuYW1lOiAnXHU3RjUxXHU3RURDXHU1REU1XHU3QTBCJyxcbiAgICAgICAgICBlbk5hbWU6ICdOZXR3b3JrIEVuZ2luZWVyaW5nJyxcbiAgICAgICAgICBzaG9ydE5hbWU6ICdcdTdGNTFcdTVERTUnLFxuICAgICAgICAgIGNvbGxlZ2VJZDogJzEnLFxuICAgICAgICAgIHN0dWR5WWVhcnM6ICc0JyxcbiAgICAgICAgICBkZWdyZWVUeXBlOiAnZW5naW5lZXJpbmcnLFxuICAgICAgICAgIGZvdW5kVGltZTogJzIwMDItMDktMDEnLFxuICAgICAgICAgIHNvcnQ6IDMsXG4gICAgICAgICAgc3RhdHVzOiB0cnVlLFxuICAgICAgICAgIHJlbWFyazogJ1x1OEJBMVx1N0I5N1x1NjczQVx1N0Y1MVx1N0VEQ1x1NjI4MFx1NjcyRlx1NEUxM1x1NEUxQScsXG4gICAgICAgICAgY3JlYXRlVGltZTogJzIwMjMtMDEtMTggMTM6NDU6MDAnLFxuICAgICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAzLTE1IDE2OjQyOjEwJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnNCcsXG4gICAgICAgICAgY29kZTogJzA4MDcwMScsXG4gICAgICAgICAgbmFtZTogJ1x1NzUzNVx1NUI1MFx1NEZFMVx1NjA2Rlx1NURFNVx1N0EwQicsXG4gICAgICAgICAgZW5OYW1lOiAnRWxlY3Ryb25pYyBJbmZvcm1hdGlvbiBFbmdpbmVlcmluZycsXG4gICAgICAgICAgc2hvcnROYW1lOiAnXHU3NTM1XHU0RkUxJyxcbiAgICAgICAgICBjb2xsZWdlSWQ6ICcyJyxcbiAgICAgICAgICBzdHVkeVllYXJzOiAnNCcsXG4gICAgICAgICAgZGVncmVlVHlwZTogJ2VuZ2luZWVyaW5nJyxcbiAgICAgICAgICBmb3VuZFRpbWU6ICcxOTgwLTA5LTAxJyxcbiAgICAgICAgICBzb3J0OiAxLFxuICAgICAgICAgIHN0YXR1czogdHJ1ZSxcbiAgICAgICAgICByZW1hcms6ICdcdTc1MzVcdTVCNTBcdTRGRTFcdTYwNkZcdTYyODBcdTY3MkZcdTRFMTNcdTRFMUEnLFxuICAgICAgICAgIGNyZWF0ZVRpbWU6ICcyMDIzLTAyLTAxIDA5OjIwOjAwJyxcbiAgICAgICAgICB1cGRhdGVUaW1lOiAnMjAyMy0wMy0xMCAwOToxNToyNScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJzUnLFxuICAgICAgICAgIGNvZGU6ICcwODA3MDInLFxuICAgICAgICAgIG5hbWU6ICdcdTkwMUFcdTRGRTFcdTVERTVcdTdBMEInLFxuICAgICAgICAgIGVuTmFtZTogJ0NvbW11bmljYXRpb24gRW5naW5lZXJpbmcnLFxuICAgICAgICAgIHNob3J0TmFtZTogJ1x1OTAxQVx1NEZFMScsXG4gICAgICAgICAgY29sbGVnZUlkOiAnMicsXG4gICAgICAgICAgc3R1ZHlZZWFyczogJzQnLFxuICAgICAgICAgIGRlZ3JlZVR5cGU6ICdlbmdpbmVlcmluZycsXG4gICAgICAgICAgZm91bmRUaW1lOiAnMTk4Mi0wOS0wMScsXG4gICAgICAgICAgc29ydDogMixcbiAgICAgICAgICBzdGF0dXM6IHRydWUsXG4gICAgICAgICAgcmVtYXJrOiAnXHU5MDFBXHU0RkUxXHU2MjgwXHU2NzJGXHU0RTEzXHU0RTFBJyxcbiAgICAgICAgICBjcmVhdGVUaW1lOiAnMjAyMy0wMi0wNSAxMTozMDowMCcsXG4gICAgICAgICAgdXBkYXRlVGltZTogJzIwMjMtMDMtMDUgMTA6MjA6MTUnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICc2JyxcbiAgICAgICAgICBjb2RlOiAnMDcwMTAxJyxcbiAgICAgICAgICBuYW1lOiAnXHU2NTcwXHU1QjY2XHU0RTBFXHU1RTk0XHU3NTI4XHU2NTcwXHU1QjY2JyxcbiAgICAgICAgICBlbk5hbWU6ICdNYXRoZW1hdGljcyBhbmQgQXBwbGllZCBNYXRoZW1hdGljcycsXG4gICAgICAgICAgc2hvcnROYW1lOiAnXHU2NTcwXHU1QjY2JyxcbiAgICAgICAgICBjb2xsZWdlSWQ6ICczJyxcbiAgICAgICAgICBzdHVkeVllYXJzOiAnNCcsXG4gICAgICAgICAgZGVncmVlVHlwZTogJ3NjaWVuY2UnLFxuICAgICAgICAgIGZvdW5kVGltZTogJzE5NjAtMDktMDEnLFxuICAgICAgICAgIHNvcnQ6IDEsXG4gICAgICAgICAgc3RhdHVzOiB0cnVlLFxuICAgICAgICAgIHJlbWFyazogJ1x1NjU3MFx1NUI2Nlx1NzQwNlx1OEJCQVx1NEUwRVx1NUU5NFx1NzUyOFx1NEUxM1x1NEUxQScsXG4gICAgICAgICAgY3JlYXRlVGltZTogJzIwMjMtMDItMTAgMTQ6MjU6MDAnLFxuICAgICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAzLTE4IDA5OjMwOjE1JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnNycsXG4gICAgICAgICAgY29kZTogJzA4MDIwMScsXG4gICAgICAgICAgbmFtZTogJ1x1NjczQVx1NjhCMFx1NURFNVx1N0EwQicsXG4gICAgICAgICAgZW5OYW1lOiAnTWVjaGFuaWNhbCBFbmdpbmVlcmluZycsXG4gICAgICAgICAgc2hvcnROYW1lOiAnXHU2NzNBXHU2OEIwJyxcbiAgICAgICAgICBjb2xsZWdlSWQ6ICc0JyxcbiAgICAgICAgICBzdHVkeVllYXJzOiAnNCcsXG4gICAgICAgICAgZGVncmVlVHlwZTogJ2VuZ2luZWVyaW5nJyxcbiAgICAgICAgICBmb3VuZFRpbWU6ICcxOTU4LTA5LTAxJyxcbiAgICAgICAgICBzb3J0OiAxLFxuICAgICAgICAgIHN0YXR1czogdHJ1ZSxcbiAgICAgICAgICByZW1hcms6ICdcdTY3M0FcdTY4QjBcdThCQkVcdThCQTFcdTRFMEVcdTUyMzZcdTkwMjBcdTRFMTNcdTRFMUEnLFxuICAgICAgICAgIGNyZWF0ZVRpbWU6ICcyMDIzLTAyLTE1IDEwOjE1OjAwJyxcbiAgICAgICAgICB1cGRhdGVUaW1lOiAnMjAyMy0wMy0yMiAxNDoxMDoyNScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJzgnLFxuICAgICAgICAgIGNvZGU6ICcwNTAyMDEnLFxuICAgICAgICAgIG5hbWU6ICdcdTgyRjFcdThCRUQnLFxuICAgICAgICAgIGVuTmFtZTogJ0VuZ2xpc2gnLFxuICAgICAgICAgIHNob3J0TmFtZTogJ1x1ODJGMVx1OEJFRCcsXG4gICAgICAgICAgY29sbGVnZUlkOiAnNScsXG4gICAgICAgICAgc3R1ZHlZZWFyczogJzQnLFxuICAgICAgICAgIGRlZ3JlZVR5cGU6ICdsaXRlcmF0dXJlJyxcbiAgICAgICAgICBmb3VuZFRpbWU6ICcxOTYyLTA5LTAxJyxcbiAgICAgICAgICBzb3J0OiAxLFxuICAgICAgICAgIHN0YXR1czogdHJ1ZSxcbiAgICAgICAgICByZW1hcms6ICdcdTgyRjFcdThCRURcdThCRURcdThBMDBcdTY1ODdcdTVCNjZcdTRFMTNcdTRFMUEnLFxuICAgICAgICAgIGNyZWF0ZVRpbWU6ICcyMDIzLTAyLTIwIDExOjQ1OjAwJyxcbiAgICAgICAgICB1cGRhdGVUaW1lOiAnMjAyMy0wMy0yNSAxNjoyMDozMCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pLFxuICB9LFxuICAvLyBcdTU3RkFcdTc4NDBcdTY1NzBcdTYzNkUtXHU1QjY2XHU5NjYyXHU1MjE3XHU4ODY4XHVGRjA4XHU3QjgwXHU1MzE2XHU3MjQ4XHVGRjBDXHU3NTI4XHU0RThFXHU0RTBCXHU2MkM5XHU5MDA5XHU2MkU5XHVGRjA5XG4gIHtcbiAgICB1cmw6ICcvYXBpL3N5c3RlbS9iYXNpYy1kYXRhL2NvbGxlZ2Uvc2VsZWN0JyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAoKSA9PiAoe1xuICAgICAgY29kZTogMCxcbiAgICAgIGRhdGE6IFtcbiAgICAgICAgeyBpZDogJzEnLCBjb2RlOiAnQ1MnLCBuYW1lOiAnXHU4QkExXHU3Qjk3XHU2NzNBXHU3OUQxXHU1QjY2XHU0RTBFXHU1REU1XHU3QTBCXHU1QjY2XHU5NjYyJyB9LFxuICAgICAgICB7IGlkOiAnMicsIGNvZGU6ICdFRScsIG5hbWU6ICdcdTc1MzVcdTVCNTBcdTVERTVcdTdBMEJcdTVCNjZcdTk2NjInIH0sXG4gICAgICAgIHsgaWQ6ICczJywgY29kZTogJ01BJywgbmFtZTogJ1x1NjU3MFx1NUI2Nlx1NEUwRVx1N0VERlx1OEJBMVx1NUI2Nlx1OTY2MicgfSxcbiAgICAgICAgeyBpZDogJzQnLCBjb2RlOiAnTUUnLCBuYW1lOiAnXHU2NzNBXHU2OEIwXHU1REU1XHU3QTBCXHU1QjY2XHU5NjYyJyB9LFxuICAgICAgICB7IGlkOiAnNScsIGNvZGU6ICdGTCcsIG5hbWU6ICdcdTU5MTZcdTU2RkRcdThCRURcdTVCNjZcdTk2NjInIH0sXG4gICAgICBdLFxuICAgIH0pLFxuICB9LFxuICAvLyBcdTU3RkFcdTc4NDBcdTY1NzBcdTYzNkUtXHU0RTEzXHU0RTFBXHU0RkUxXHU2MDZGLVx1NkRGQlx1NTJBMFxuICB7XG4gICAgdXJsOiAnL2FwaS9zeXN0ZW0vYmFzaWMtZGF0YS9tYWpvci9hZGQnLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH06IHsgYm9keTogYW55IH0pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAuLi5ib2R5LFxuICAgICAgICAgIGlkOiBgJHtEYXRlLm5vdygpfWAsXG4gICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSksXG4gICAgICAgICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSksXG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2U6ICdcdTZERkJcdTUyQTBcdTYyMTBcdTUyOUYnLFxuICAgICAgfTtcbiAgICB9LFxuICB9LFxuICAvLyBcdTU3RkFcdTc4NDBcdTY1NzBcdTYzNkUtXHU0RTEzXHU0RTFBXHU0RkUxXHU2MDZGLVx1NjZGNFx1NjVCMFxuICB7XG4gICAgdXJsOiAnL2FwaS9zeXN0ZW0vYmFzaWMtZGF0YS9tYWpvci91cGRhdGUnLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH06IHsgYm9keTogYW55IH0pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAuLi5ib2R5LFxuICAgICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKCdUJywgJyAnKS5zdWJzdHJpbmcoMCwgMTkpLFxuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlOiAnXHU2NkY0XHU2NUIwXHU2MjEwXHU1MjlGJyxcbiAgICAgIH07XG4gICAgfSxcbiAgfSxcbiAgLy8gXHU1N0ZBXHU3ODQwXHU2NTcwXHU2MzZFLVx1NEUxM1x1NEUxQVx1NEZFMVx1NjA2Ri1cdTUyMjBcdTk2NjRcbiAge1xuICAgIHVybDogJy9hcGkvc3lzdGVtL2Jhc2ljLWRhdGEvbWFqb3IvZGVsZXRlJyxcbiAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICByZXNwb25zZTogKCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgbWVzc2FnZTogJ1x1NTIyMFx1OTY2NFx1NjIxMFx1NTI5RicsXG4gICAgICB9O1xuICAgIH0sXG4gIH0sXG4gIC8vIFx1OEJGRVx1N0EwQlx1NEVFM1x1NzgwMVx1ODlDNFx1NTIxOVx1NzZGOFx1NTE3M1x1NjNBNVx1NTNFM1xuICB7XG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UtY29kZS1ydWxlcycsXG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICByZXNwb25zZTogKCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGxpc3Q6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6ICcxJyxcbiAgICAgICAgICAgICAgbmFtZTogJ1x1OEJBMVx1N0I5N1x1NjczQVx1NEUxM1x1NEUxQVx1OEJGRVx1N0EwQlx1NEVFM1x1NzgwMVx1ODlDNFx1NTIxOScsXG4gICAgICAgICAgICAgIHByZWZpeDogJ0NTJyxcbiAgICAgICAgICAgICAgc3RhcnROdW06IDEwMDEsXG4gICAgICAgICAgICAgIGN1cnJlbnROdW06IDEwNDUsXG4gICAgICAgICAgICAgIGRpZ2l0TGVuZ3RoOiA0LFxuICAgICAgICAgICAgICBjb3Vyc2VOYXR1cmU6ICdcdTRFMTNcdTRFMUFcdTVGQzVcdTRGRUVcdThCRkUnLFxuICAgICAgICAgICAgICBkZXBhcnRtZW50OiAnXHU4QkExXHU3Qjk3XHU2NzNBXHU3OUQxXHU1QjY2XHU0RTBFXHU2MjgwXHU2NzJGXHU1QjY2XHU5NjYyJyxcbiAgICAgICAgICAgICAgY291cnNlQ2F0ZWdvcnk6ICdcdTRFMTNcdTRFMUFcdTU3RkFcdTc4NDBcdThCRkUnLFxuICAgICAgICAgICAgICBjb3Vyc2VUeXBlOiAnXHU3NDA2XHU4QkJBXHU4QkZFJyxcbiAgICAgICAgICAgICAgZXhhbVR5cGU6ICdcdTgwMDNcdThCRDUnLFxuICAgICAgICAgICAgICBjb3Vyc2VBdHRyOiAnXHU1QjY2XHU0RjREXHU4QkZFJyxcbiAgICAgICAgICAgICAgY3JlZGl0OiA0LFxuICAgICAgICAgICAgICBzZXJpYWxOdW1iZXI6ICdBJyxcbiAgICAgICAgICAgICAgaXNBY3RpdmU6IHRydWUsXG4gICAgICAgICAgICAgIGNyZWF0ZVRpbWU6ICcyMDIzLTAxLTE1IDA4OjMwOjAwJyxcbiAgICAgICAgICAgICAgdXBkYXRlVGltZTogJzIwMjMtMDMtMjAgMTQ6MjI6MzAnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogJzInLFxuICAgICAgICAgICAgICBuYW1lOiAnXHU3NTM1XHU1QjUwXHU0RkUxXHU2MDZGXHU1REU1XHU3QTBCXHU4QkZFXHU3QTBCXHU0RUUzXHU3ODAxXHU4OUM0XHU1MjE5JyxcbiAgICAgICAgICAgICAgcHJlZml4OiAnRUUnLFxuICAgICAgICAgICAgICBzdGFydE51bTogMjAwMSxcbiAgICAgICAgICAgICAgY3VycmVudE51bTogMjAyMyxcbiAgICAgICAgICAgICAgZGlnaXRMZW5ndGg6IDQsXG4gICAgICAgICAgICAgIGNvdXJzZU5hdHVyZTogJ1x1NEUxM1x1NEUxQVx1OTAwOVx1NEZFRVx1OEJGRScsXG4gICAgICAgICAgICAgIGRlcGFydG1lbnQ6ICdcdTc1MzVcdTVCNTBcdTRGRTFcdTYwNkZcdTVERTVcdTdBMEJcdTVCNjZcdTk2NjInLFxuICAgICAgICAgICAgICBjb3Vyc2VDYXRlZ29yeTogJ1x1NEUxM1x1NEUxQVx1NjVCOVx1NTQxMVx1OEJGRScsXG4gICAgICAgICAgICAgIGNvdXJzZVR5cGU6ICdcdTVCOUVcdTlBOENcdThCRkUnLFxuICAgICAgICAgICAgICBleGFtVHlwZTogJ1x1ODAwM1x1NjdFNScsXG4gICAgICAgICAgICAgIGNvdXJzZUF0dHI6ICdcdTk3NUVcdTVCNjZcdTRGNERcdThCRkUnLFxuICAgICAgICAgICAgICBjcmVkaXQ6IDIsXG4gICAgICAgICAgICAgIHNlcmlhbE51bWJlcjogJ0InLFxuICAgICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgY3JlYXRlVGltZTogJzIwMjMtMDEtMTUgMDk6MTU6MDAnLFxuICAgICAgICAgICAgICB1cGRhdGVUaW1lOiAnMjAyMy0wMi0yOCAxMTozMDo0NSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiAnMycsXG4gICAgICAgICAgICAgIG5hbWU6ICdcdThGNkZcdTRFRjZcdTVERTVcdTdBMEJcdThCRkVcdTdBMEJcdTRFRTNcdTc4MDFcdTg5QzRcdTUyMTknLFxuICAgICAgICAgICAgICBwcmVmaXg6ICdTRScsXG4gICAgICAgICAgICAgIHN0YXJ0TnVtOiAzMDAxLFxuICAgICAgICAgICAgICBjdXJyZW50TnVtOiAzMDEyLFxuICAgICAgICAgICAgICBkaWdpdExlbmd0aDogNCxcbiAgICAgICAgICAgICAgY291cnNlTmF0dXJlOiAnXHU1MTZDXHU1MTcxXHU1RkM1XHU0RkVFXHU4QkZFJyxcbiAgICAgICAgICAgICAgZGVwYXJ0bWVudDogJ1x1OEY2Rlx1NEVGNlx1NUI2Nlx1OTY2MicsXG4gICAgICAgICAgICAgIGNvdXJzZUNhdGVnb3J5OiAnXHU5MDFBXHU4QkM2XHU4QkZFJyxcbiAgICAgICAgICAgICAgY291cnNlVHlwZTogJ1x1NzQwNlx1OEJCQVx1NUI5RVx1OERGNVx1OEJGRScsXG4gICAgICAgICAgICAgIGV4YW1UeXBlOiAnXHU4MDAzXHU4QkQ1JyxcbiAgICAgICAgICAgICAgY291cnNlQXR0cjogJ1x1NUI2Nlx1NEY0RFx1OEJGRScsXG4gICAgICAgICAgICAgIGNyZWRpdDogMyxcbiAgICAgICAgICAgICAgc2VyaWFsTnVtYmVyOiAnQycsXG4gICAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgICBjcmVhdGVUaW1lOiAnMjAyMy0wMS0xNiAxMDoyMDowMCcsXG4gICAgICAgICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAzLTE1IDE2OjQyOjEwJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6ICc0JyxcbiAgICAgICAgICAgICAgbmFtZTogJ1x1NEVCQVx1NURFNVx1NjY3QVx1ODBGRFx1OEJGRVx1N0EwQlx1NEVFM1x1NzgwMVx1ODlDNFx1NTIxOScsXG4gICAgICAgICAgICAgIHByZWZpeDogJ0FJJyxcbiAgICAgICAgICAgICAgc3RhcnROdW06IDQwMDEsXG4gICAgICAgICAgICAgIGN1cnJlbnROdW06IDQwMDgsXG4gICAgICAgICAgICAgIGRpZ2l0TGVuZ3RoOiA0LFxuICAgICAgICAgICAgICBjb3Vyc2VOYXR1cmU6ICdcdTUxNkNcdTUxNzFcdTkwMDlcdTRGRUVcdThCRkUnLFxuICAgICAgICAgICAgICBkZXBhcnRtZW50OiAnXHU0RUJBXHU1REU1XHU2NjdBXHU4MEZEXHU1QjY2XHU5NjYyJyxcbiAgICAgICAgICAgICAgY291cnNlQ2F0ZWdvcnk6ICdcdTRFMTNcdTRFMUFcdTY4MzhcdTVGQzNcdThCRkUnLFxuICAgICAgICAgICAgICBjb3Vyc2VUeXBlOiAnXHU1QjlFXHU4REY1XHU4QkZFJyxcbiAgICAgICAgICAgICAgZXhhbVR5cGU6ICdcdTgwMDNcdTY3RTUnLFxuICAgICAgICAgICAgICBjb3Vyc2VBdHRyOiAnXHU5NzVFXHU1QjY2XHU0RjREXHU4QkZFJyxcbiAgICAgICAgICAgICAgY3JlZGl0OiAyLFxuICAgICAgICAgICAgICBzZXJpYWxOdW1iZXI6ICdEJyxcbiAgICAgICAgICAgICAgaXNBY3RpdmU6IGZhbHNlLFxuICAgICAgICAgICAgICBjcmVhdGVUaW1lOiAnMjAyMy0wMi0wNSAxMzo0NTowMCcsXG4gICAgICAgICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAzLTEwIDA5OjE1OjI1J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6ICc1JyxcbiAgICAgICAgICAgICAgbmFtZTogJ1x1NjU3MFx1NjM2RVx1NzlEMVx1NUI2Nlx1OEJGRVx1N0EwQlx1NEVFM1x1NzgwMVx1ODlDNFx1NTIxOScsXG4gICAgICAgICAgICAgIHByZWZpeDogJ0RTJyxcbiAgICAgICAgICAgICAgc3RhcnROdW06IDUwMDEsXG4gICAgICAgICAgICAgIGN1cnJlbnROdW06IDUwMDUsXG4gICAgICAgICAgICAgIGRpZ2l0TGVuZ3RoOiA0LFxuICAgICAgICAgICAgICBjb3Vyc2VOYXR1cmU6ICdcdTkwMUFcdThCQzZcdTkwMDlcdTRGRUVcdThCRkUnLFxuICAgICAgICAgICAgICBkZXBhcnRtZW50OiAnXHU2NTcwXHU2MzZFXHU3OUQxXHU1QjY2XHU1QjY2XHU5NjYyJyxcbiAgICAgICAgICAgICAgY291cnNlQ2F0ZWdvcnk6ICdcdTUyMUJcdTY1QjBcdTUyMUJcdTRFMUFcdThCRkUnLFxuICAgICAgICAgICAgICBjb3Vyc2VUeXBlOiAnXHU3NDA2XHU4QkJBXHU4QkZFJyxcbiAgICAgICAgICAgICAgZXhhbVR5cGU6ICdcdTgwMDNcdThCRDUnLFxuICAgICAgICAgICAgICBjb3Vyc2VBdHRyOiAnXHU1QjY2XHU0RjREXHU4QkZFJyxcbiAgICAgICAgICAgICAgY3JlZGl0OiAxLFxuICAgICAgICAgICAgICBzZXJpYWxOdW1iZXI6ICdFJyxcbiAgICAgICAgICAgICAgaXNBY3RpdmU6IHRydWUsXG4gICAgICAgICAgICAgIGNyZWF0ZVRpbWU6ICcyMDIzLTAyLTEwIDE1OjMwOjAwJyxcbiAgICAgICAgICAgICAgdXBkYXRlVGltZTogJzIwMjMtMDMtMDUgMTA6MjA6MTUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICB0b3RhbDogNVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAge1xuICAgIHVybDogJy9hcGkvY291cnNlLWNvZGUtcnVsZXMvOmlkJyxcbiAgICBtZXRob2Q6ICdnZXQnLFxuICAgIHJlc3BvbnNlOiAoeyBxdWVyeSB9KSA9PiB7XG4gICAgICBjb25zdCB7IGlkIH0gPSBxdWVyeTtcbiAgICAgIGNvbnN0IHJ1bGUgPSB7XG4gICAgICAgIGlkLFxuICAgICAgICBuYW1lOiBgXHU4QkZFXHU3QTBCXHU0RUUzXHU3ODAxXHU4OUM0XHU1MjE5JHtpZH1gLFxuICAgICAgICBwcmVmaXg6IFsnQ1MnLCAnRUUnLCAnU0UnLCAnQUknLCAnRFMnXVtwYXJzZUludChpZCkgJSA1XSxcbiAgICAgICAgc3RhcnROdW06IDEwMDAgKyBwYXJzZUludChpZCkgKiAxMCxcbiAgICAgICAgY3VycmVudE51bTogMTAwMCArIHBhcnNlSW50KGlkKSAqIDEwICsgNSxcbiAgICAgICAgZGlnaXRMZW5ndGg6IDQsXG4gICAgICAgIGNvdXJzZU5hdHVyZTogWydcdTRFMTNcdTRFMUFcdTVGQzVcdTRGRUVcdThCRkUnLCAnXHU0RTEzXHU0RTFBXHU5MDA5XHU0RkVFXHU4QkZFJywgJ1x1NTE2Q1x1NTE3MVx1NUZDNVx1NEZFRVx1OEJGRScsICdcdTUxNkNcdTUxNzFcdTkwMDlcdTRGRUVcdThCRkUnLCAnXHU5MDFBXHU4QkM2XHU5MDA5XHU0RkVFXHU4QkZFJ11bcGFyc2VJbnQoaWQpICUgNV0sXG4gICAgICAgIGRlcGFydG1lbnQ6IFsnXHU4QkExXHU3Qjk3XHU2NzNBXHU3OUQxXHU1QjY2XHU0RTBFXHU2MjgwXHU2NzJGXHU1QjY2XHU5NjYyJywgJ1x1NzUzNVx1NUI1MFx1NEZFMVx1NjA2Rlx1NURFNVx1N0EwQlx1NUI2Nlx1OTY2MicsICdcdThGNkZcdTRFRjZcdTVCNjZcdTk2NjInLCAnXHU0RUJBXHU1REU1XHU2NjdBXHU4MEZEXHU1QjY2XHU5NjYyJywgJ1x1NjU3MFx1NjM2RVx1NzlEMVx1NUI2Nlx1NUI2Nlx1OTY2MiddW3BhcnNlSW50KGlkKSAlIDVdLFxuICAgICAgICBjb3Vyc2VDYXRlZ29yeTogWydcdTRFMTNcdTRFMUFcdTU3RkFcdTc4NDBcdThCRkUnLCAnXHU0RTEzXHU0RTFBXHU2NUI5XHU1NDExXHU4QkZFJywgJ1x1OTAxQVx1OEJDNlx1OEJGRScsICdcdTRFMTNcdTRFMUFcdTY4MzhcdTVGQzNcdThCRkUnLCAnXHU1MjFCXHU2NUIwXHU1MjFCXHU0RTFBXHU4QkZFJ11bcGFyc2VJbnQoaWQpICUgNV0sXG4gICAgICAgIGNvdXJzZVR5cGU6IFsnXHU3NDA2XHU4QkJBXHU4QkZFJywgJ1x1NUI5RVx1OUE4Q1x1OEJGRScsICdcdTc0MDZcdThCQkFcdTVCOUVcdThERjVcdThCRkUnLCAnXHU1QjlFXHU4REY1XHU4QkZFJywgJ1x1NzQwNlx1OEJCQVx1OEJGRSddW3BhcnNlSW50KGlkKSAlIDVdLFxuICAgICAgICBleGFtVHlwZTogWydcdTgwMDNcdThCRDUnLCAnXHU4MDAzXHU2N0U1JywgJ1x1ODAwM1x1OEJENScsICdcdTgwMDNcdTY3RTUnLCAnXHU4MDAzXHU4QkQ1J11bcGFyc2VJbnQoaWQpICUgNV0sXG4gICAgICAgIGNvdXJzZUF0dHI6IFsnXHU1QjY2XHU0RjREXHU4QkZFJywgJ1x1OTc1RVx1NUI2Nlx1NEY0RFx1OEJGRScsICdcdTVCNjZcdTRGNERcdThCRkUnLCAnXHU5NzVFXHU1QjY2XHU0RjREXHU4QkZFJywgJ1x1NUI2Nlx1NEY0RFx1OEJGRSddW3BhcnNlSW50KGlkKSAlIDVdLFxuICAgICAgICBjcmVkaXQ6IFs0LCAyLCAzLCAyLCAxXVtwYXJzZUludChpZCkgJSA1XSxcbiAgICAgICAgc2VyaWFsTnVtYmVyOiBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRSddW3BhcnNlSW50KGlkKSAlIDVdLFxuICAgICAgICBpc0FjdGl2ZTogQm9vbGVhbihwYXJzZUludChpZCkgJSAyKSxcbiAgICAgICAgY3JlYXRlVGltZTogJzIwMjMtMDEtMTUgMDg6MzA6MDAnLFxuICAgICAgICB1cGRhdGVUaW1lOiAnMjAyMy0wMy0yMCAxNDoyMjozMCdcbiAgICAgIH07XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiAwLFxuICAgICAgICBkYXRhOiBydWxlXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAge1xuICAgIHVybDogJy9hcGkvY291cnNlLWNvZGUtcnVsZXMnLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH0pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAuLi5ib2R5LFxuICAgICAgICAgIGlkOiBgJHtEYXRlLm5vdygpfWAsXG4gICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSksXG4gICAgICAgICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSlcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS1jb2RlLXJ1bGVzLzppZCcsXG4gICAgbWV0aG9kOiAncHV0JyxcbiAgICByZXNwb25zZTogKHsgYm9keSB9KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgLi4uYm9keSxcbiAgICAgICAgICB1cGRhdGVUaW1lOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnVCcsICcgJykuc3Vic3RyaW5nKDAsIDE5KVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAge1xuICAgIHVybDogJy9hcGkvY291cnNlLWNvZGUtcnVsZXMvOmlkJyxcbiAgICBtZXRob2Q6ICdkZWxldGUnLFxuICAgIHJlc3BvbnNlOiAoeyBxdWVyeSB9KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgaWQ6IHF1ZXJ5LmlkXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9XG5dIGFzIE1vY2tNZXRob2RbXTtcblxuLy8gXHU2REZCXHU1MkEwXHU4QkZFXHU3QTBCXHU1RTkzXHU0RUUzXHU3ODAxXHU4OUM0XHU1MjE5XHU3Njg0IG1vY2sgXHU2M0E1XHU1M0UzXG5jb25zdCBjb3Vyc2VDb2RlUnVsZXNNb2NrOiBNb2NrTWV0aG9kW10gPSBbXG4gIHtcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS1saWJyYXJ5L2NvZGUtcnVsZXMnLFxuICAgIG1ldGhvZDogJ2dldCcsXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBsaXN0OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiAnMScsXG4gICAgICAgICAgICAgIG5hbWU6ICdcdThCQTFcdTdCOTdcdTY3M0FcdTRFMTNcdTRFMUFcdThCRkVcdTdBMEJcdTRFRTNcdTc4MDFcdTg5QzRcdTUyMTknLFxuICAgICAgICAgICAgICBwcmVmaXg6ICdDUycsXG4gICAgICAgICAgICAgIHN0YXJ0TnVtOiAxMDAxLFxuICAgICAgICAgICAgICBjdXJyZW50TnVtOiAxMDQ1LFxuICAgICAgICAgICAgICBkaWdpdExlbmd0aDogNCxcbiAgICAgICAgICAgICAgY291cnNlTmF0dXJlOiAnXHU0RTEzXHU0RTFBXHU1RkM1XHU0RkVFXHU4QkZFJyxcbiAgICAgICAgICAgICAgZGVwYXJ0bWVudDogJ1x1OEJBMVx1N0I5N1x1NjczQVx1NzlEMVx1NUI2Nlx1NEUwRVx1NjI4MFx1NjcyRlx1NUI2Nlx1OTY2MicsXG4gICAgICAgICAgICAgIGNvdXJzZUNhdGVnb3J5OiAnXHU0RTEzXHU0RTFBXHU1N0ZBXHU3ODQwXHU4QkZFJyxcbiAgICAgICAgICAgICAgY291cnNlVHlwZTogJ1x1NzQwNlx1OEJCQVx1OEJGRScsXG4gICAgICAgICAgICAgIGV4YW1UeXBlOiAnXHU4MDAzXHU4QkQ1JyxcbiAgICAgICAgICAgICAgY291cnNlQXR0cjogJ1x1NUI2Nlx1NEY0RFx1OEJGRScsXG4gICAgICAgICAgICAgIGNyZWRpdDogNCxcbiAgICAgICAgICAgICAgc2VyaWFsTnVtYmVyOiAnQScsXG4gICAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgICBjcmVhdGVUaW1lOiAnMjAyMy0wMS0xNSAwODozMDowMCcsXG4gICAgICAgICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAzLTIwIDE0OjIyOjMwJyxcbiAgICAgICAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG9yZGVyOiAxLFxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlcGFydG1lbnQnLFxuICAgICAgICAgICAgICAgICAgY29kZVR5cGU6ICdzeXN0ZW0nLFxuICAgICAgICAgICAgICAgICAgZGlnaXRUeXBlOiAncHJlZml4JyxcbiAgICAgICAgICAgICAgICAgIGRpZ2l0Q291bnQ6IDJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG9yZGVyOiAyLFxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvdXJzZU5hdHVyZScsXG4gICAgICAgICAgICAgICAgICBjb2RlVHlwZTogJ3N5c3RlbScsXG4gICAgICAgICAgICAgICAgICBkaWdpdFR5cGU6ICdzdWZmaXgnLFxuICAgICAgICAgICAgICAgICAgZGlnaXRDb3VudDogMVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgb3JkZXI6IDMsXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnc2VyaWFsTnVtYmVyJyxcbiAgICAgICAgICAgICAgICAgIGNvZGVUeXBlOiAnc3lzdGVtJyxcbiAgICAgICAgICAgICAgICAgIGRpZ2l0VHlwZTogJ3N1ZmZpeCcsXG4gICAgICAgICAgICAgICAgICBkaWdpdENvdW50OiAzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogJzInLFxuICAgICAgICAgICAgICBuYW1lOiAnXHU3NTM1XHU1QjUwXHU0RkUxXHU2MDZGXHU1REU1XHU3QTBCXHU4QkZFXHU3QTBCXHU0RUUzXHU3ODAxXHU4OUM0XHU1MjE5JyxcbiAgICAgICAgICAgICAgcHJlZml4OiAnRUUnLFxuICAgICAgICAgICAgICBzdGFydE51bTogMjAwMSxcbiAgICAgICAgICAgICAgY3VycmVudE51bTogMjAyMyxcbiAgICAgICAgICAgICAgZGlnaXRMZW5ndGg6IDQsXG4gICAgICAgICAgICAgIGNvdXJzZU5hdHVyZTogJ1x1NEUxM1x1NEUxQVx1OTAwOVx1NEZFRVx1OEJGRScsXG4gICAgICAgICAgICAgIGRlcGFydG1lbnQ6ICdcdTc1MzVcdTVCNTBcdTRGRTFcdTYwNkZcdTVERTVcdTdBMEJcdTVCNjZcdTk2NjInLFxuICAgICAgICAgICAgICBjb3Vyc2VDYXRlZ29yeTogJ1x1NEUxM1x1NEUxQVx1NjVCOVx1NTQxMVx1OEJGRScsXG4gICAgICAgICAgICAgIGNvdXJzZVR5cGU6ICdcdTVCOUVcdTlBOENcdThCRkUnLFxuICAgICAgICAgICAgICBleGFtVHlwZTogJ1x1ODAwM1x1NjdFNScsXG4gICAgICAgICAgICAgIGNvdXJzZUF0dHI6ICdcdTk3NUVcdTVCNjZcdTRGNERcdThCRkUnLFxuICAgICAgICAgICAgICBjcmVkaXQ6IDIsXG4gICAgICAgICAgICAgIHNlcmlhbE51bWJlcjogJ0InLFxuICAgICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgY3JlYXRlVGltZTogJzIwMjMtMDEtMTUgMDk6MTU6MDAnLFxuICAgICAgICAgICAgICB1cGRhdGVUaW1lOiAnMjAyMy0wMi0yOCAxMTozMDo0NScsXG4gICAgICAgICAgICAgIGNvbXBvbmVudHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBvcmRlcjogMSxcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZXBhcnRtZW50JyxcbiAgICAgICAgICAgICAgICAgIGNvZGVUeXBlOiAnc3lzdGVtJyxcbiAgICAgICAgICAgICAgICAgIGRpZ2l0VHlwZTogJ3ByZWZpeCcsXG4gICAgICAgICAgICAgICAgICBkaWdpdENvdW50OiAyXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBvcmRlcjogMixcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb3Vyc2VUeXBlJyxcbiAgICAgICAgICAgICAgICAgIGNvZGVUeXBlOiAnc3lzdGVtJyxcbiAgICAgICAgICAgICAgICAgIGRpZ2l0VHlwZTogJ3N1ZmZpeCcsXG4gICAgICAgICAgICAgICAgICBkaWdpdENvdW50OiAxXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBvcmRlcjogMyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzZXJpYWxOdW1iZXInLFxuICAgICAgICAgICAgICAgICAgY29kZVR5cGU6ICdzeXN0ZW0nLFxuICAgICAgICAgICAgICAgICAgZGlnaXRUeXBlOiAnc3VmZml4JyxcbiAgICAgICAgICAgICAgICAgIGRpZ2l0Q291bnQ6IDNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICAgIHRvdGFsOiAyXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9LFxuICB7XG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UtbGlicmFyeS9jb2RlLXJ1bGVzLzppZCcsXG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICByZXNwb25zZTogKHsgcXVlcnkgfSkgPT4ge1xuICAgICAgY29uc3QgeyBpZCB9ID0gcXVlcnk7XG4gICAgICBjb25zdCBydWxlID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgbmFtZTogYFx1OEJGRVx1N0EwQlx1NEVFM1x1NzgwMVx1ODlDNFx1NTIxOSR7aWR9YCxcbiAgICAgICAgcHJlZml4OiBbJ0NTJywgJ0VFJywgJ1NFJywgJ0FJJywgJ0RTJ11bcGFyc2VJbnQoaWQgYXMgc3RyaW5nKSAlIDVdLFxuICAgICAgICBzdGFydFNlcmlhbE51bWJlcjogMTAwMCArIHBhcnNlSW50KGlkIGFzIHN0cmluZykgKiAxMCxcbiAgICAgICAgY3VycmVudFNlcmlhbE51bWJlcjogMTAwMCArIHBhcnNlSW50KGlkIGFzIHN0cmluZykgKiAxMCArIDUsXG4gICAgICAgIHNlcmlhbE51bWJlckxlbmd0aDogNCxcbiAgICAgICAgY291cnNlTmF0dXJlOiBbJ1x1NEUxM1x1NEUxQVx1NUZDNVx1NEZFRVx1OEJGRScsICdcdTRFMTNcdTRFMUFcdTkwMDlcdTRGRUVcdThCRkUnLCAnXHU1MTZDXHU1MTcxXHU1RkM1XHU0RkVFXHU4QkZFJywgJ1x1NTE2Q1x1NTE3MVx1OTAwOVx1NEZFRVx1OEJGRScsICdcdTkwMUFcdThCQzZcdTkwMDlcdTRGRUVcdThCRkUnXVtwYXJzZUludChpZCBhcyBzdHJpbmcpICUgNV0sXG4gICAgICAgIGRlcGFydG1lbnQ6IFsnXHU4QkExXHU3Qjk3XHU2NzNBXHU3OUQxXHU1QjY2XHU0RTBFXHU2MjgwXHU2NzJGXHU1QjY2XHU5NjYyJywgJ1x1NzUzNVx1NUI1MFx1NEZFMVx1NjA2Rlx1NURFNVx1N0EwQlx1NUI2Nlx1OTY2MicsICdcdThGNkZcdTRFRjZcdTVCNjZcdTk2NjInLCAnXHU0RUJBXHU1REU1XHU2NjdBXHU4MEZEXHU1QjY2XHU5NjYyJywgJ1x1NjU3MFx1NjM2RVx1NzlEMVx1NUI2Nlx1NUI2Nlx1OTY2MiddW3BhcnNlSW50KGlkIGFzIHN0cmluZykgJSA1XSxcbiAgICAgICAgY291cnNlQ2F0ZWdvcnk6IFsnXHU0RTEzXHU0RTFBXHU1N0ZBXHU3ODQwXHU4QkZFJywgJ1x1NEUxM1x1NEUxQVx1NjVCOVx1NTQxMVx1OEJGRScsICdcdTkwMUFcdThCQzZcdThCRkUnLCAnXHU0RTEzXHU0RTFBXHU2ODM4XHU1RkMzXHU4QkZFJywgJ1x1NTIxQlx1NjVCMFx1NTIxQlx1NEUxQVx1OEJGRSddW3BhcnNlSW50KGlkIGFzIHN0cmluZykgJSA1XSxcbiAgICAgICAgY291cnNlVHlwZTogWydcdTc0MDZcdThCQkFcdThCRkUnLCAnXHU1QjlFXHU5QThDXHU4QkZFJywgJ1x1NzQwNlx1OEJCQVx1NUI5RVx1OERGNVx1OEJGRScsICdcdTVCOUVcdThERjVcdThCRkUnLCAnXHU3NDA2XHU4QkJBXHU4QkZFJ11bcGFyc2VJbnQoaWQgYXMgc3RyaW5nKSAlIDVdLFxuICAgICAgICBleGFtVHlwZTogWydcdTgwMDNcdThCRDUnLCAnXHU4MDAzXHU2N0U1JywgJ1x1ODAwM1x1OEJENScsICdcdTgwMDNcdTY3RTUnLCAnXHU4MDAzXHU4QkQ1J11bcGFyc2VJbnQoaWQgYXMgc3RyaW5nKSAlIDVdLFxuICAgICAgICBjb3Vyc2VBdHRyOiBbJ1x1NUI2Nlx1NEY0RFx1OEJGRScsICdcdTk3NUVcdTVCNjZcdTRGNERcdThCRkUnLCAnXHU1QjY2XHU0RjREXHU4QkZFJywgJ1x1OTc1RVx1NUI2Nlx1NEY0RFx1OEJGRScsICdcdTVCNjZcdTRGNERcdThCRkUnXVtwYXJzZUludChpZCBhcyBzdHJpbmcpICUgNV0sXG4gICAgICAgIGNyZWRpdDogWzQsIDIsIDMsIDIsIDFdW3BhcnNlSW50KGlkIGFzIHN0cmluZykgJSA1XSxcbiAgICAgICAgaXNBY3RpdmU6IEJvb2xlYW4ocGFyc2VJbnQoaWQgYXMgc3RyaW5nKSAlIDIpLFxuICAgICAgICBjcmVhdGVUaW1lOiAnMjAyMy0wMS0xNSAwODozMDowMCcsXG4gICAgICAgIHVwZGF0ZVRpbWU6ICcyMDIzLTAzLTIwIDE0OjIyOjMwJyxcbiAgICAgICAgY29tcG9uZW50czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9yZGVyOiAxLFxuICAgICAgICAgICAgdHlwZTogJ2RlcGFydG1lbnQnLFxuICAgICAgICAgICAgY29kZVR5cGU6ICdzeXN0ZW0nLFxuICAgICAgICAgICAgZGlnaXRUeXBlOiAncHJlZml4JyxcbiAgICAgICAgICAgIGRpZ2l0Q291bnQ6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9yZGVyOiAyLFxuICAgICAgICAgICAgdHlwZTogcGFyc2VJbnQoaWQgYXMgc3RyaW5nKSAlIDIgPT09IDAgPyAnY291cnNlTmF0dXJlJyA6ICdjb3Vyc2VUeXBlJyxcbiAgICAgICAgICAgIGNvZGVUeXBlOiAnc3lzdGVtJyxcbiAgICAgICAgICAgIGRpZ2l0VHlwZTogJ3N1ZmZpeCcsXG4gICAgICAgICAgICBkaWdpdENvdW50OiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvcmRlcjogMyxcbiAgICAgICAgICAgIHR5cGU6ICdzZXJpYWxOdW1iZXInLFxuICAgICAgICAgICAgY29kZVR5cGU6ICdzeXN0ZW0nLFxuICAgICAgICAgICAgZGlnaXRUeXBlOiAnc3VmZml4JyxcbiAgICAgICAgICAgIGRpZ2l0Q291bnQ6IDNcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIGRlc2NyaXB0aW9uOiBgXHU4RkQ5XHU2NjJGXHU4QkZFXHU3QTBCXHU0RUUzXHU3ODAxXHU4OUM0XHU1MjE5JHtpZH1cdTc2ODRcdThCRjRcdTY2MEVgXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgZGF0YTogcnVsZVxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS1saWJyYXJ5L2NvZGUtcnVsZXMnLFxuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH0pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAuLi5ib2R5LFxuICAgICAgICAgIGlkOiBgJHtEYXRlLm5vdygpfWAsXG4gICAgICAgICAgY3JlYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSksXG4gICAgICAgICAgdXBkYXRlVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSlcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIHtcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS1saWJyYXJ5L2NvZGUtcnVsZXMvOmlkJyxcbiAgICBtZXRob2Q6ICdwdXQnLFxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH0pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAuLi5ib2R5LFxuICAgICAgICAgIHVwZGF0ZVRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKCdUJywgJyAnKS5zdWJzdHJpbmcoMCwgMTkpXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9LFxuICB7XG4gICAgdXJsOiAnL2FwaS9jb3Vyc2UtbGlicmFyeS9jb2RlLXJ1bGVzLzppZCcsXG4gICAgbWV0aG9kOiAnZGVsZXRlJyxcbiAgICByZXNwb25zZTogKHsgcXVlcnkgfSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGlkOiBxdWVyeS5pZFxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXTtcblxuLy8gXHU1QzA2XHU0RTI0XHU3RUM0IG1vY2sgXHU2NUI5XHU2Q0Q1XHU1NDA4XHU1RTc2XHU1NDBFXHU1QkZDXHU1MUZBXG5leHBvcnQgZGVmYXVsdCBbLi4ub3JpZ2luYWxNb2NrTWV0aG9kcywgLi4uY291cnNlQXBpcywgLi4uY291cnNlSW1wb3J0RXhwb3J0QXBpcywgLi4uY291cnNlQ29kZVJ1bGVzTW9jaywgLi4uY291cnNlQnJvd3NlQXBpc10gYXMgTW9ja01ldGhvZFtdO1xuIiwgImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSEMuUlxcXFxEZXNrdG9wXFxcXGNoYXRcXFxcU1JQXFxcXE5TUlBcXFxcUlBcXFxcbW9ja1xcXFxjb3Vyc2UtYnJvd3NlLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIkM6XFxcXFVzZXJzXFxcXEhDLlJcXFxcRGVza3RvcFxcXFxjaGF0XFxcXFNSUFxcXFxOU1JQXFxcXFJQXFxcXG1vY2tcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL0M6L1VzZXJzL0hDLlIvRGVza3RvcC9jaGF0L1NSUC9OU1JQL1JQL21vY2svY291cnNlLWJyb3dzZS50c1wiO2ltcG9ydCBNb2NrIGZyb20gJ21vY2tqcyc7XHJcbmltcG9ydCB7IE1vY2tNZXRob2QgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJztcclxuXHJcbi8vIFx1OEJGRVx1N0EwQlx1NkQ0Rlx1ODlDOG1vY2tcdTY1NzBcdTYzNkVcclxuY29uc3QgY291cnNlQnJvd3NlTGlzdCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDUwIH0pLm1hcCgoXywgaW5kZXgpID0+ICh7XHJcbiAgaWQ6IGAke2luZGV4ICsgMX1gLFxyXG4gIGNvZGU6IGBDJHsoMTAwMDAgKyBpbmRleCkudG9TdHJpbmcoKX1gLFxyXG4gIG5hbWU6IGBcdTc5M0FcdTRGOEJcdThCRkVcdTdBMEIke2luZGV4ICsgMX1gLFxyXG4gIGVuZ2xpc2hOYW1lOiBgRXhhbXBsZSBDb3Vyc2UgJHtpbmRleCArIDF9YCxcclxuICBjYXRlZ29yeTogWydcdTUxNkNcdTUxNzFcdTU3RkFcdTc4NDBcdThCRkUnLCAnXHU0RTEzXHU0RTFBXHU1N0ZBXHU3ODQwXHU4QkZFJywgJ1x1NEUxM1x1NEUxQVx1OEJGRScsICdcdTVCOUVcdThERjVcdTY1NTlcdTVCNjYnLCAnXHU5MDFBXHU4QkM2XHU5MDA5XHU0RkVFXHU4QkZFJ11bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSldLFxyXG4gIG5hdHVyZTogWydcdTVGQzVcdTRGRUUnLCAnXHU5MDA5XHU0RkVFJywgJ1x1OTY1MFx1OTAwOSddW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMpXSxcclxuICBjcmVkaXRzOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1KSArIDEsXHJcbiAgdGhlb3J5SG91cnM6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMwKSArIDEwLFxyXG4gIHByYWN0aWNlSG91cnM6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIwKSxcclxuICB0b3RhbEhvdXJzOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMudGhlb3J5SG91cnMgKyB0aGlzLnByYWN0aWNlSG91cnM7IH0sXHJcbiAgZXhhbVR5cGU6IFsnXHU4MDAzXHU4QkQ1JywgJ1x1ODAwM1x1NjdFNScsICdcdThCQkFcdTY1ODcnLCAnXHU4QkJFXHU4QkExJywgJ1x1NjRDRFx1NEY1QyddW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpXSxcclxuICBkZXBhcnRtZW50OiBbJ1x1OEJBMVx1N0I5N1x1NjczQVx1NUI2Nlx1OTY2MicsICdcdTY3M0FcdTY4QjBcdTVCNjZcdTk2NjInLCAnXHU3NTM1XHU1QjUwXHU0RkUxXHU2MDZGXHU1QjY2XHU5NjYyJywgJ1x1NTkxNlx1NTZGRFx1OEJFRFx1NUI2Nlx1OTY2MiddW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpXSxcclxuICBpc0NvcmU6IE1hdGgucmFuZG9tKCkgPiAwLjUsXHJcbiAgaXNCaWxpbmd1YWw6IE1hdGgucmFuZG9tKCkgPiAwLjcsXHJcbiAgZGVzY3JpcHRpb246IGBcdThGRDlcdTY2MkZcdTRFMDBcdTk1RThcdTc5M0FcdTRGOEJcdThCRkVcdTdBMEJcdUZGMENcdTc1MjhcdTRFOEVcdTVDNTVcdTc5M0FcdThCRkVcdTdBMEJcdTRGRTFcdTYwNkZcdTMwMDJgLFxyXG4gIGNyZWF0ZVRpbWU6IE1vY2suUmFuZG9tLmRhdGV0aW1lKCd5eXl5LU1NLWRkIEhIOm1tOnNzJylcclxufSkpO1xyXG5cclxuLy8gXHU4QkZFXHU3QTBCXHU2RDRGXHU4OUM4XHU3NkY4XHU1MTczXHU2M0E1XHU1M0UzXHJcbmNvbnN0IGNvdXJzZUJyb3dzZUFwaXM6IE1vY2tNZXRob2RbXSA9IFtcclxuICAvLyBcdTgzQjdcdTUzRDZcdThCRkVcdTdBMEJcdTZENEZcdTg5QzhcdTUyMTdcdTg4NjhcclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NvdXJzZS9icm93c2UnLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBxdWVyeSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgcGFnZVNpemUgPSAxMCwgcGFnZUluZGV4ID0gMSwgbmFtZSA9ICcnLCBjb2RlID0gJycsIGNhdGVnb3J5ID0gJycsIG5hdHVyZSA9ICcnLCBkZXBhcnRtZW50ID0gJycgfSA9IHF1ZXJ5O1xyXG4gICAgICBcclxuICAgICAgbGV0IGZpbHRlcmVkTGlzdCA9IFsuLi5jb3Vyc2VCcm93c2VMaXN0XTtcclxuICAgICAgXHJcbiAgICAgIC8vIFx1N0I1Qlx1OTAwOVxyXG4gICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgIGZpbHRlcmVkTGlzdCA9IGZpbHRlcmVkTGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtLm5hbWUuaW5jbHVkZXMobmFtZSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjb2RlKSB7XHJcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uY29kZS5pbmNsdWRlcyhjb2RlKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGNhdGVnb3J5KSB7XHJcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uY2F0ZWdvcnkgPT09IGNhdGVnb3J5KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAobmF0dXJlKSB7XHJcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0ubmF0dXJlID09PSBuYXR1cmUpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkZXBhcnRtZW50KSB7XHJcbiAgICAgICAgZmlsdGVyZWRMaXN0ID0gZmlsdGVyZWRMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW0uZGVwYXJ0bWVudCA9PT0gZGVwYXJ0bWVudCk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8vIFx1NTIwNlx1OTg3NVxyXG4gICAgICBjb25zdCBzdGFydCA9IChwYWdlSW5kZXggLSAxKSAqIHBhZ2VTaXplO1xyXG4gICAgICBjb25zdCBlbmQgPSBwYWdlSW5kZXggKiBwYWdlU2l6ZTtcclxuICAgICAgY29uc3QgbGlzdCA9IGZpbHRlcmVkTGlzdC5zbGljZShzdGFydCwgZW5kKTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBsaXN0LFxyXG4gICAgICAgICAgdG90YWw6IGZpbHRlcmVkTGlzdC5sZW5ndGgsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlOiAnb2snLFxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG4gIFxyXG4gIC8vIFx1OEJGRVx1N0EwQlx1NkQ0Rlx1ODlDOFx1NUJGQ1x1NTFGQVxyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY291cnNlL2Jyb3dzZS9leHBvcnQnLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKHsgYm9keSB9KSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY29kZTogMCxcclxuICAgICAgICBtZXNzYWdlOiAnXHU1QkZDXHU1MUZBXHU2MjEwXHU1MjlGJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICB1cmw6ICdodHRwOi8vZXhhbXBsZS5jb20vY291cnNlLWJyb3dzZS54bHN4JyxcclxuICAgICAgICAgIGZpbGVOYW1lOiAnXHU4QkZFXHU3QTBCXHU2RDRGXHU4OUM4XHU2NTcwXHU2MzZFXycgKyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApLnJlcGxhY2UoLy0vZywgJycpICsgJy54bHN4JyxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY291cnNlQnJvd3NlQXBpczsgIl0sCiAgIm1hcHBpbmdzIjog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VUFDWCxXQUFXO0FBQUEsVUFDWCxZQUFZO0FBQUEsVUFDWixZQUFZO0FBQUEsVUFDWixXQUFXO0FBQUEsVUFDWCxNQUFNO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixRQUFRO0FBQUEsVUFDUixZQUFZO0FBQUEsVUFDWixZQUFZO0FBQUEsUUFDZDtBQUFBLFFBQ0E7QUFBQSxVQUNFLElBQUk7QUFBQSxVQUNKLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLFdBQVc7QUFBQSxVQUNYLFdBQVc7QUFBQSxVQUNYLFlBQVk7QUFBQSxVQUNaLFlBQVk7QUFBQSxVQUNaLFdBQVc7QUFBQSxVQUNYLE1BQU07QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLFFBQVE7QUFBQSxVQUNSLFlBQVk7QUFBQSxVQUNaLFlBQVk7QUFBQSxRQUNkO0FBQUEsUUFDQTtBQUFBLFVBQ0UsSUFBSTtBQUFBLFVBQ0osTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsV0FBVztBQUFBLFVBQ1gsV0FBVztBQUFBLFVBQ1gsWUFBWTtBQUFBLFVBQ1osWUFBWTtBQUFBLFVBQ1osV0FBVztBQUFBLFVBQ1gsTUFBTTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsUUFBUTtBQUFBLFVBQ1IsWUFBWTtBQUFBLFVBQ1osWUFBWTtBQUFBLFFBQ2Q7QUFBQSxRQUNBO0FBQUEsVUFDRSxJQUFJO0FBQUEsVUFDSixNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixXQUFXO0FBQUEsVUFDWCxXQUFXO0FBQUEsVUFDWCxZQUFZO0FBQUEsVUFDWixZQUFZO0FBQUEsVUFDWixXQUFXO0FBQUEsVUFDWCxNQUFNO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixRQUFRO0FBQUEsVUFDUixZQUFZO0FBQUEsVUFDWixZQUFZO0FBQUEsUUFDZDtBQUFBLFFBQ0E7QUFBQSxVQUNFLElBQUk7QUFBQSxVQUNKLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxVQUNOLFFBQVE7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
