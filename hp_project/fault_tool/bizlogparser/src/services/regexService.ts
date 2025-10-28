/**
 * @description 正则筛选服务
 */
export async function filterStateFlow(content: string) {
  console.log('[Regex] 正在筛选状态机流程数据，长度:', content.length);
  const res = await window.regex.filterStateFlow(content);
  console.log('[Regex] 筛选结果:', res.success ? '成功' : '失败');
  return res;
}
