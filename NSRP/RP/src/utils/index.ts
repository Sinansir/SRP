/**
 * 工具函数集合
 */

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
export function getUniqueId(): string {
  return `id_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
}

/**
 * 延迟函数
 * @param ms 延迟时间(毫秒)
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 深拷贝函数
 * @param obj 要拷贝的对象
 * @returns 拷贝后的新对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any;
  }
  
  if (obj instanceof Object) {
    const copy = {} as any;
    Object.keys(obj).forEach((key) => {
      copy[key] = deepClone((obj as any)[key]);
    });
    return copy;
  }
  
  return obj;
}

/**
 * 格式化日期
 * @param date 日期对象或字符串
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 扩展名(不含点)
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
} 