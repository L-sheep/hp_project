/**
 * 筛选出包含 [State] 但不包含 TASK 的行
 * @param content 多行字符串内容
 * @returns 匹配后的行（按行拼接）
 */
export function filterStateFlow(content: string): string {
    return content
      .split('\n')
      .filter(line => line.includes('[State]') && line.includes('STATE') && !line.includes('TASK'))
      .join('\n');
  }
  