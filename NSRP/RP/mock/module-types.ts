import Mock from 'mockjs';
import { MockMethod } from 'vite-plugin-mock';

// 模块类型接口
export interface ModuleType {
  id: string;
  name: string;
  code: string;
  moduleType: string;
  createTime: string;
  updateTime?: string;
}

// 模块子类接口
export interface ModuleSubtype {
  id: string;
  name: string;
  code: string;
  typeId: string;
  createTime: string;
  updateTime?: string;
}

// 模块类别与子类别映射
export interface ModuleCategory {
  typeId: string;
  subtypeId: string;
}

// 模块类型数据
let moduleTypes: ModuleType[] = [
  {
    id: '1',
    name: '通识教育模块',
    code: 'GE',
    moduleType: 'general_education',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '2',
    name: '学科基础模块',
    code: 'DB',
    moduleType: 'discipline_basic',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '3',
    name: '专业教育模块',
    code: 'PE',
    moduleType: 'professional_education',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '4',
    name: '实践教学模块',
    code: 'PT',
    moduleType: 'practical_teaching',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '5',
    name: '公共基础模块',
    code: 'PB',
    moduleType: 'public_basic',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
];

// 模块子类数据
let moduleSubtypes: ModuleSubtype[] = [
  // 通识教育模块子类
  {
    id: '101',
    name: '思想政治类',
    code: 'GE-POL',
    typeId: '1',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '102',
    name: '人文艺术类',
    code: 'GE-HUM',
    typeId: '1',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '103',
    name: '体育健康类',
    code: 'GE-PE',
    typeId: '1',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '104',
    name: '科学素养类',
    code: 'GE-SCI',
    typeId: '1',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  
  // 学科基础模块子类
  {
    id: '201',
    name: '数学类',
    code: 'DB-MATH',
    typeId: '2',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '202',
    name: '物理类',
    code: 'DB-PHY',
    typeId: '2',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '203',
    name: '化学类',
    code: 'DB-CHEM',
    typeId: '2',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  
  // 专业教育模块子类
  {
    id: '301',
    name: '专业必修类',
    code: 'PE-REQ',
    typeId: '3',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '302',
    name: '专业选修类',
    code: 'PE-ELEC',
    typeId: '3',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '303',
    name: '专业方向类',
    code: 'PE-DIR',
    typeId: '3',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  
  // 实践教学模块子类
  {
    id: '401',
    name: '实验实训类',
    code: 'PT-LAB',
    typeId: '4',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '402',
    name: '实习实践类',
    code: 'PT-PRAC',
    typeId: '4',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '403',
    name: '毕业设计类',
    code: 'PT-GRAD',
    typeId: '4',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  
  // 公共基础模块子类
  {
    id: '501',
    name: '思想政治类',
    code: 'PB-POL',
    typeId: '5',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '502',
    name: '外语类',
    code: 'PB-LANG',
    typeId: '5',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '503',
    name: '高等数学类',
    code: 'PB-MATH',
    typeId: '5',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: '504',
    name: '体育类',
    code: 'PB-PE',
    typeId: '5',
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  },
];

// 模块类别与子类别映射
let moduleCategories: ModuleCategory[] = moduleSubtypes.map(subtype => ({
  typeId: subtype.typeId,
  subtypeId: subtype.id,
}));

// 添加新的模块类型
export const addModuleType = (newType: Omit<ModuleType, 'id' | 'createTime'>) => {
  // 生成新的ID
  const lastId = moduleTypes.length > 0 ? parseInt(moduleTypes[moduleTypes.length - 1].id, 10) : 0;
  const newId = String(lastId + 1);

  const typeToAdd: ModuleType = {
    ...newType,
    id: newId,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  };

  moduleTypes.push(typeToAdd);
  return typeToAdd;
};

// 更新模块类型
export const updateModuleType = (id: string, updates: Partial<ModuleType>) => {
  const index = moduleTypes.findIndex((type) => type.id === id);
  if (index === -1) {
    return null;
  }

  moduleTypes[index] = {
    ...moduleTypes[index],
    ...updates,
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  };

  return moduleTypes[index];
};

// 根据typeId获取子类型
export const getSubtypesByTypeId = (typeId: string) => {
  return moduleSubtypes.filter((subtype) => subtype.typeId === typeId);
};

// 根据子类型ID获取课程列表
export const getCoursesBySubtypeId = (subtypeId: string) => {
  return moduleTypeSubtypeCourses[subtypeId] || [];
};

// 模块子类对应的课程数据
const moduleTypeSubtypeCourses = {
  // 思想政治类课程
  '101': [
    { id: 'c101001', name: '思想道德修养与法律基础', credits: 3, code: 'POL1001', term: '1-1', required: true },
    { id: 'c101002', name: '中国近现代史纲要', credits: 3, code: 'POL1002', term: '1-2', required: true },
    { id: 'c101003', name: '马克思主义基本原理', credits: 3, code: 'POL2001', term: '2-1', required: true },
    { id: 'c101004', name: '毛泽东思想和中国特色社会主义理论体系概论', credits: 5, code: 'POL2002', term: '2-2', required: true },
    { id: 'c101005', name: '形势与政策', credits: 2, code: 'POL9001', term: '1-1,1-2,2-1,2-2', required: true },
  ],
  
  // 人文艺术类课程
  '102': [
    { id: 'c102001', name: '中国文化概论', credits: 2, code: 'HUM1001', term: '1-1', required: false },
    { id: 'c102002', name: '艺术鉴赏', credits: 2, code: 'HUM1002', term: '1-2', required: false },
    { id: 'c102003', name: '哲学导论', credits: 2, code: 'HUM2001', term: '2-1', required: false },
    { id: 'c102004', name: '文学经典赏析', credits: 2, code: 'HUM2002', term: '2-2', required: false },
  ],
  
  // 体育健康类课程
  '103': [
    { id: 'c103001', name: '体育(一)', credits: 1, code: 'PE1001', term: '1-1', required: true },
    { id: 'c103002', name: '体育(二)', credits: 1, code: 'PE1002', term: '1-2', required: true },
    { id: 'c103003', name: '体育(三)', credits: 1, code: 'PE2001', term: '2-1', required: true },
    { id: 'c103004', name: '体育(四)', credits: 1, code: 'PE2002', term: '2-2', required: true },
    { id: 'c103005', name: '健康教育', credits: 1, code: 'PE1003', term: '1-1', required: true },
  ],
  
  // 外语类课程
  '502': [
    { id: 'c502001', name: '大学英语(一)', credits: 4, code: 'ENG1001', term: '1-1', required: true },
    { id: 'c502002', name: '大学英语(二)', credits: 4, code: 'ENG1002', term: '1-2', required: true },
    { id: 'c502003', name: '大学英语(三)', credits: 4, code: 'ENG2001', term: '2-1', required: true },
    { id: 'c502004', name: '大学英语(四)', credits: 4, code: 'ENG2002', term: '2-2', required: true },
  ],
  
  // 高等数学类课程
  '503': [
    { id: 'c503001', name: '高等数学A(上)', credits: 5, code: 'MATH1001', term: '1-1', required: true },
    { id: 'c503002', name: '高等数学A(下)', credits: 5, code: 'MATH1002', term: '1-2', required: true },
    { id: 'c503003', name: '线性代数', credits: 3, code: 'MATH1003', term: '1-2', required: true },
    { id: 'c503004', name: '概率论与数理统计', credits: 3, code: 'MATH2001', term: '2-1', required: true },
  ],
  
  // 体育类课程
  '504': [
    { id: 'c504001', name: '体育(一)', credits: 1, code: 'PE1001', term: '1-1', required: true },
    { id: 'c504002', name: '体育(二)', credits: 1, code: 'PE1002', term: '1-2', required: true },
    { id: 'c504003', name: '体育(三)', credits: 1, code: 'PE2001', term: '2-1', required: true },
    { id: 'c504004', name: '体育(四)', credits: 1, code: 'PE2002', term: '2-2', required: true },
  ],
  
  // 数学类课程
  '201': [
    { id: 'c201001', name: '数学分析(上)', credits: 5, code: 'MATH2101', term: '1-1', required: true },
    { id: 'c201002', name: '数学分析(下)', credits: 5, code: 'MATH2102', term: '1-2', required: true },
    { id: 'c201003', name: '空间解析几何', credits: 3, code: 'MATH2103', term: '1-1', required: true },
    { id: 'c201004', name: '高等代数', credits: 4, code: 'MATH2104', term: '1-2', required: true },
  ],
  
  // 物理类课程
  '202': [
    { id: 'c202001', name: '普通物理(力学)', credits: 4, code: 'PHY2101', term: '1-1', required: true },
    { id: 'c202002', name: '普通物理(电磁学)', credits: 4, code: 'PHY2102', term: '1-2', required: true },
    { id: 'c202003', name: '普通物理(光学)', credits: 3, code: 'PHY2103', term: '2-1', required: true },
    { id: 'c202004', name: '普通物理(热学)', credits: 3, code: 'PHY2104', term: '2-2', required: false },
  ],
};

// 获取所有模块类型
export const getAllModuleTypes = () => {
  return [...moduleTypes];
};

// 获取所有模块子类
export const getAllModuleSubtypes = () => {
  return [...moduleSubtypes];
};

// 删除模块类型
export const deleteModuleType = (id: string) => {
  const initialLength = moduleTypes.length;
  moduleTypes = moduleTypes.filter((type) => type.id !== id);

  // 同时删除关联的子类型
  moduleSubtypes = moduleSubtypes.filter((subtype) => subtype.typeId !== id);
  moduleCategories = moduleCategories.filter((category) => category.typeId !== id);

  return initialLength > moduleTypes.length;
};

// 添加新的模块子类
export const addModuleSubtype = (newSubtype: Omit<ModuleSubtype, 'id' | 'createTime'>) => {
  // 确保类型ID存在
  if (!moduleTypes.some((type) => type.id === newSubtype.typeId)) {
    return null;
  }

  // 生成新的ID
  const lastId = moduleSubtypes.length > 0 ? parseInt(moduleSubtypes[moduleSubtypes.length - 1].id, 10) : 0;
  const newId = String(lastId + 1);

  const subtypeToAdd: ModuleSubtype = {
    ...newSubtype,
    id: newId,
    createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  };

  moduleSubtypes.push(subtypeToAdd);

  // 添加映射关系
  moduleCategories.push({
    typeId: subtypeToAdd.typeId,
    subtypeId: subtypeToAdd.id,
  });

  return subtypeToAdd;
};

// 更新模块子类
export const updateModuleSubtype = (id: string, updates: Partial<ModuleSubtype>) => {
  const index = moduleSubtypes.findIndex((subtype) => subtype.id === id);
  if (index === -1) {
    return null;
  }

  moduleSubtypes[index] = {
    ...moduleSubtypes[index],
    ...updates,
    updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
  };

  return moduleSubtypes[index];
};

// 删除模块子类
export const deleteModuleSubtype = (id: string) => {
  const initialLength = moduleSubtypes.length;
  moduleSubtypes = moduleSubtypes.filter((subtype) => subtype.id !== id);
  moduleCategories = moduleCategories.filter((category) => category.subtypeId !== id);

  return initialLength > moduleSubtypes.length;
};

export default [
  // 获取模块类型列表
  {
    url: '/api/program/module-types',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: moduleTypes,
        message: 'ok',
      };
    },
  },

  // 获取模块子类列表
  {
    url: '/api/program/module-subtypes',
    method: 'get',
    response: ({ query }: { query: { typeId?: string } }) => {
      const { typeId } = query;
      let result = [...moduleSubtypes];

      if (typeId) {
        result = result.filter((item) => item.typeId === typeId);
      }

      return {
        code: 0,
        data: result,
        message: 'ok',
      };
    },
  },

  // 获取模块类型子类别映射
  {
    url: '/api/program/module-categories',
    method: 'get',
    response: () => {
      // 构建类型到子类别的映射
      const typeToCategories = {};
      moduleTypes.forEach(type => {
        const subtypes = getSubtypesByTypeId(type.id);
        typeToCategories[type.moduleType] = subtypes.map(subtype => subtype.id);
      });

      return {
        code: 0,
        data: Object.keys(typeToCategories).map(key => ({
          parentType: key,
          categories: typeToCategories[key]
        })),
        message: 'ok',
      };
    },
  },

  // 获取模块子类课程列表
  {
    url: '/api/program/module-subtype-courses/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const courses = getCoursesBySubtypeId(params.id);
      return {
        code: 0,
        data: courses,
        message: 'ok',
      };
    },
  },

  // 添加模块类型
  {
    url: '/api/program/module-types',
    method: 'post',
    response: ({ body }: { body: Partial<ModuleType> }) => {
      const newType = addModuleType({
        name: body.name || '',
        code: body.code || '',
        moduleType: body.moduleType || '',
      });

      return {
        code: 0,
        data: newType,
        message: 'ok',
      };
    },
  },

  // 更新模块类型
  {
    url: '/api/program/module-types/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: Partial<ModuleType> }) => {
      const updatedType = updateModuleType(params.id, body);

      if (!updatedType) {
        return {
          code: 400,
          message: '模块类型不存在',
        };
      }

      return {
        code: 0,
        data: updatedType,
        message: 'ok',
      };
    },
  },

  // 删除模块类型
  {
    url: '/api/program/module-types/:id',
    method: 'delete',
    response: ({ params }: { params: { id: string } }) => {
      const success = deleteModuleType(params.id);

      if (!success) {
        return {
          code: 400,
          message: '模块类型不存在',
        };
      }

      return {
        code: 0,
        data: null as any,
        message: 'ok',
      };
    },
  },

  // 添加模块子类
  {
    url: '/api/program/module-subtypes',
    method: 'post',
    response: ({ body }: { body: Partial<ModuleSubtype> }) => {
      const newSubtype = addModuleSubtype({
        name: body.name || '',
        code: body.code || '',
        typeId: body.typeId || '',
      });

      if (!newSubtype) {
        return {
          code: 400,
          message: '父模块类型不存在',
        };
      }

      return {
        code: 0,
        data: newSubtype,
        message: 'ok',
      };
    },
  },

  // 更新模块子类
  {
    url: '/api/program/module-subtypes/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: Partial<ModuleSubtype> }) => {
      const updatedSubtype = updateModuleSubtype(params.id, body);

      if (!updatedSubtype) {
        return {
          code: 400,
          message: '模块子类不存在',
        };
      }

      return {
        code: 0,
        data: updatedSubtype,
        message: 'ok',
      };
    },
  },

  // 删除模块子类
  {
    url: '/api/program/module-subtypes/:id',
    method: 'delete',
    response: ({ params }: { params: { id: string } }) => {
      const success = deleteModuleSubtype(params.id);

      if (!success) {
        return {
          code: 400,
          message: '模块子类不存在',
        };
      }

      return {
        code: 0,
        data: null as any,
        message: 'ok',
      };
    },
  },
] as MockMethod[];
