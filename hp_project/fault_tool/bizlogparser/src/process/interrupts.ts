//src/process/interrupts.ts
export enum InterruptLevel {
    INVALID = 0,
    MSG_WORK = 1,      // 普通信息-工作消息
    MSG_ABNORMAL = 2,  // 普通信息-特殊状态
    MSG_FAULT = 3,     // 普通信息-故障
    MSG_ALWAYS = 4,    // 普通信息-常驻
    FAULT = 5,         // 常驻故障
    SECURITY = 6       // 安规
  }
  
  type InterruptInfo = {
    description: string;
    level: InterruptLevel;
  };
  
  export const InterruptMap: Record<number, InterruptInfo> = {
    0: { description: "[抬起] 安规", level: InterruptLevel.SECURITY },
    1: { description: "[倾斜] 安规", level: InterruptLevel.SECURITY },
    2: { description: "[被困] 常驻故障", level: InterruptLevel.FAULT },
    3: { description: "[基站附近可通行区域过小] 常驻故障", level: InterruptLevel.FAULT },
    4: { description: "[左驱动轮] 常驻故障", level: InterruptLevel.FAULT },
    5: { description: "[右驱动轮] 常驻故障", level: InterruptLevel.FAULT },
    6: { description: "[抬升电机] 常驻故障", level: InterruptLevel.FAULT },
    7: { description: "[刀盘不转] 常驻故障", level: InterruptLevel.FAULT },
    8: { description: "[偏摆电机] 常驻故障", level: InterruptLevel.FAULT },
    9: { description: "[撞板异常] 常驻故障", level: InterruptLevel.FAULT },
    10: { description: "[充电异常] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    11: { description: "[电池高温] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    12: { description: "[雷达被遮蔽] 常驻故障", level: InterruptLevel.FAULT },
    13: { description: "[雷达温度偏高(无图)] 常驻故障", level: InterruptLevel.FAULT },
    14: { description: "[雷达温度偏高(有图)] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    15: { description: "[雷达温度过高] 常驻故障", level: InterruptLevel.FAULT },
    16: { description: "[雷达脏污] 常驻故障", level: InterruptLevel.FAULT },
    17: { description: "[雷达异常] 常驻故障", level: InterruptLevel.FAULT },
    18: { description: "[定位信号弱] 常驻故障", level: InterruptLevel.FAULT },
    19: { description: "[定位丢失] 常驻故障", level: InterruptLevel.FAULT },
    20: { description: "[传感器异常] 常驻故障", level: InterruptLevel.FAULT },
    21: { description: "[禁区中] 常驻故障", level: InterruptLevel.FAULT },
    22: { description: "[超出地图范围] 常驻故障", level: InterruptLevel.FAULT },
    23: { description: "[紧急按钮] 安规", level: InterruptLevel.SECURITY },
    24: { description: "[没电保护] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    25: { description: "[地图文件损坏] 常驻故障", level: InterruptLevel.FAULT },
    26: { description: "[防盗-GPS超出地图范围报警] 常驻故障", level: InterruptLevel.FAULT },
    27: { description: "[有人进入报警] 普通信息-常驻", level: InterruptLevel.MSG_ALWAYS },
    28: { description: "[刀片重度损耗] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    29: { description: "[基站清洁] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    30: { description: "[保养时间] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    31: { description: "[回充失败，无法找到回充点] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    32: { description: "[对接基站失败] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    33: { description: "[定位失败(有图)] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    34: { description: "[定位失败(无图)] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    35: { description: "[定位异常(无图)] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    36: { description: "[任务无法启动(导航)] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    37: { description: "[通道无法通行] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    38: { description: "[雷达脏污，不影响机器工作，仅告警] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    39: { description: "[摄像头脏污] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    40: { description: "[摄像头异常] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    41: { description: "[摄像头遮蔽] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    42: { description: "[电池高温提醒，mcu给的是60度，45度要自己检] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    43: { description: "[电池低温提醒，mcu低温0度，5度要自己检] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    44: { description: "[自动建图, 边界识别异常] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    45: { description: "[自动建图, 骑边有风险] 普通信息-故障", level: InterruptLevel.MSG_FAULT },
    46: { description: "[边界识别完成] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    47: { description: "[检测有新的地图] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    48: { description: "[工作结束] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    49: { description: "[任务位置无法到达] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    50: { description: "[工作启动] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    51: { description: "[巡航启动] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    52: { description: "[指哪去哪启动] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    53: { description: "[开始计划任务] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    54: { description: "[低电自动回充] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    55: { description: "[低电，延迟计划表] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    56: { description: "[恶劣天气保护，自动回充] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    57: { description: "[雨淋，不启动计划表] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    58: { description: "[雨淋，延迟计划表] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    59: { description: "[霜冻保护，自动回充] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    60: { description: "[霜冻保护，延迟计划表] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    61: { description: "[勿扰时间，自动回充] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    62: { description: "[勿扰时间，延迟计划表] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    63: { description: "[任务中，不启动计划表] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    64: { description: "[遥控中，不启动计划表] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    65: { description: "[急停未解除，不启动计划表] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    66: { description: "[翻盖没有合上，不启动计划表] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    67: { description: "[故障中，不启动计划表] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    68: { description: "[计划表时间不够] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    69: { description: "[基站工作区域不连通] 普通信息-特殊状态", level: InterruptLevel.MSG_ABNORMAL },
    70: { description: "[断点续割] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    71: { description: "[待机超时回充] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    72: { description: "[暂停超时回充] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    73: { description: "[翻盖打开] 普通信息-常驻", level: InterruptLevel.MSG_ALWAYS },
    74: { description: "[巡航任务完成] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    75: { description: "[到达清洁任务完成] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    76: { description: "[清洁点无法到达] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    77: { description: "[清洁点途中任务异常] 普通信息-工作消息", level: InterruptLevel.MSG_WORK },
    78: { description: "[未知中断] 普通信息-故障", level: InterruptLevel.MSG_FAULT }
  };
  
  /**
   * 将输入日志字符串转为带中文说明的格式，并可选按等级过滤
   * @param logString 原始日志字符串
   * @param minLevel 可选，最小等级（包含）过滤
   * @returns 处理后的日志文本
   */
  export function convertLogString(logString: string, minLevel?: InterruptLevel): string {
    return logString
      .split('\n')
      .map(line => {
        const match = line.match(/interrupt (\d+)/);
        if (!match) return null;
  
        const code = parseInt(match[1], 10);
        const info = InterruptMap[code];
  
        if (!info) return `${line} - [未知中断] 未知说明`;
        if (minLevel !== undefined && info.level < minLevel) return null;
  
        return `${line} - ${info.description}`;
      })
      .filter(Boolean)
      .join('\n');
  }
  