/** Generate 20 clearly labelled industry demo sites from the shared Astro layout. */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagesHostnames = {
  'fleet-architecture': 'fleet-architecture-dtv.pages.dev',
  'fleet-health': 'fleet-health-7yv.pages.dev',
  'fleet-saas': 'fleet-saas-bwv.pages.dev',
};
const projects = [
  ['architecture','序构建筑','建筑设计','让空间回应生活','从住宅更新到公共空间，以清晰的设计语言连接使用需求、场地环境与长期价值。','好的建筑从倾听开始，再把复杂条件转化为可居住、可使用的空间。','重视空间品质的业主与团队',['空间策划|梳理功能、动线与场地约束，形成可讨论的设计方向。','建筑方案|将体量、采光与材料整合成完整的空间提案。','项目协同|以图纸和节点沟通，帮助设计意图贯穿实施过程。'],'#173e38','#f3f1e8','#c5744e','#d6ded6'],
  ['dental','齿间计划','口腔诊所','把每一次就诊变得安心','用清楚的就诊指引、舒适的空间体验和易懂的口腔知识，呈现现代口腔服务。','让患者先理解过程，再做适合自己的选择。','关注口腔健康的家庭',['预约导览|说明初诊流程、准备事项与就诊路径。','预防护理|介绍日常检查、清洁与长期维护思路。','治疗介绍|用通俗语言展示不同问题的常见处理方向。'],'#194a53','#f3f8f6','#4b9e9d','#dcebe8'],
  ['legal','衡理事务','法律服务','复杂问题，清晰回应','面向企业经营与个人事务，展示专业服务范围、合作流程和沟通方式。','先厘清事实与目标，再讨论可执行的路径。','需要明确法律支持的客户',['企业合规|围绕日常经营建立清晰的风险识别框架。','合同事务|梳理交易条款、履约节点与沟通重点。','争议应对|通过材料整理和策略讨论准备下一步行动。'],'#252d47','#f4f1e9','#a56c44','#dedbd1'],
  ['coffee','山序咖啡','咖啡品牌','从一杯咖啡开始，慢下来','呈现豆子的风味、冲煮方式与门店氛围，让日常片刻有值得记住的温度。','好味道来自对原料、烘焙与分享方式的持续关注。','喜欢咖啡与安静时光的人',['咖啡豆系列|以风味轮廓帮助访客找到偏爱的口感。','冲煮指南|用简单步骤介绍日常可实践的冲煮方法。','空间体验|展示适合阅读、交流与短暂停留的场景。'],'#3f3329','#f7efe4','#b46a3d','#eadbc7'],
  ['fitness','动量实验室','健身工作室','找到适合自己的节奏','从体能评估到训练安排，以易理解的课程体系支持持续运动。','训练应当适合真实生活，并能被长期坚持。','想建立运动习惯的人',['基础训练|循序建立力量、稳定性和动作感知。','团体课程|在有节奏的课堂中保持动力与参与感。','训练规划|根据时间安排和目标调整训练重点。'],'#1e292b','#f2f4ee','#d86d44','#d9e0d8'],
  ['education','知阶学堂','教育机构','让学习有路径可循','为不同阶段的学习者整理课程方向、学习方法和成长支持。','将目标拆成可理解、可实践、可回顾的每一步。','希望持续成长的学习者',['课程体系|按主题和阶段组织清晰的学习内容。','学习支持|提供练习、反馈与复盘的参考框架。','成长路径|帮助学习者看见当前阶段与下一步方向。'],'#28446a','#f4f3eb','#e4a449','#dce5eb'],
  ['travel','远行地图','旅行策划','把目的地还给好奇心','从城市漫游到自然探索，以主题路线展示更有节奏的旅行方式。','好的旅行计划留出发现的空间，也照顾真实的时间与预算。','想深入体验目的地的旅人',['主题路线|按文化、自然与美食设计不同探索方式。','行前准备|整理交通、天气和行程节奏的实用信息。','目的地笔记|用简明内容呈现值得停留的地点与故事。'],'#1e504d','#eff5ef','#d58256','#d8e8dc'],
  ['interior','栖物设计','室内设计','让日常住得更自在','以居住习惯为起点，探索材质、光线与收纳之间的平衡。','室内设计的价值在于让每天的动作都更自然。','准备改善居住空间的人',['需求梳理|梳理家庭成员、收纳与使用场景。','空间方案|将布局、灯光与材料形成统一的设计语言。','软装建议|通过家具和细节建立舒适的生活氛围。'],'#4a413b','#f7f4ed','#9f8060','#e8dfd2'],
  ['saas','流线数据','数据分析软件','让关键数据一目了然','将分散的信息整理成直观的视图，帮助团队理解变化、分享发现与协调行动。','数据产品应该缩短从看到问题到采取行动的距离。','需要协作分析的业务团队',['可视化面板|将核心指标组织成清晰可读的页面。','数据整合|为不同来源的信息建立统一查看入口。','共享报告|让团队围绕同一组数据展开讨论。'],'#122a3f','#eef5f8','#2a9fa3','#d6e9ed'],
  ['logistics','路标物流','物流服务','让每一次交付更有把握','展示运输、仓储与履约服务的协作方式，帮助企业理解交付链路。','透明的节点和明确的责任，让供应链协同更顺畅。','重视履约体验的商家',['运输规划|按货物特点和时效要求梳理运输方案。','仓储协同|展示入库、库存与出库流程的衔接。','交付跟踪|用清楚的节点信息支持沟通和查询。'],'#263a42','#f2f4ef','#ed864f','#dae3df'],
  ['photography','留光影像','摄影工作室','把重要时刻留在光里','以简洁的作品展示和服务介绍，呈现人物、品牌与空间摄影的不同表达。','每一张照片都从观察和理解拍摄对象开始。','希望留下真实画面的个人与品牌',['人物肖像|用自然的互动捕捉人物状态与情绪。','品牌影像|围绕产品和故事建立一致的视觉表达。','空间记录|通过光线和构图呈现空间的使用氛围。'],'#292b34','#f4f1eb','#b68167','#dedbd9'],
  ['pets','爪印日常','宠物服务','陪伴，从照顾每一天开始','面向宠物家庭展示日常护理、活动与知识内容，传递友好的服务体验。','理解动物的习惯，也尊重每个家庭的生活方式。','关心宠物日常的家庭',['日常护理|介绍清洁、梳理与舒适照护的基础安排。','活动空间|展示适合互动与放松的活动场景。','养护知识|整理日常观察和生活管理的入门内容。'],'#42513b','#f8f5ec','#c5874b','#e4eadb'],
  ['beauty','见己美学','美容工作室','把照顾自己放进日常','用温和的视觉与清晰的项目说明，呈现个人护理与放松体验。','从需求沟通开始，让每一次护理都更从容。','希望给自己留出时间的人',['护理体验|介绍服务步骤与舒适度相关的注意事项。','项目选择|用易懂方式对比不同护理内容。','日常建议|分享可融入生活的基础护理习惯。'],'#563e45','#faf1ef','#bd7c83','#f0dedf'],
  ['agriculture','青田农场','农业品牌','从土地到餐桌，看见生长','以季节、作物与种植过程为线索，展示农产品背后的日常。','尊重季节与土地，让食物的来源更清楚。','在意食物来源的家庭',['当季作物|按季节介绍不同农产品与食用方式。','种植记录|展示田间管理与收获过程。','食材灵感|提供简洁的储存与料理建议。'],'#34523f','#f4f5e9','#d09442','#dce5ce'],
  ['finance','有数财务','财务咨询','让经营数字说得明白','面向小型企业展示财务梳理、预算规划与经营分析的服务思路。','清楚的数字能帮助经营者做出更稳妥的判断。','需要理解经营状况的创业团队',['财务梳理|整理收支结构与基础报表阅读方式。','预算规划|按经营目标设计可跟踪的预算框架。','经营分析|从变化趋势中寻找值得进一步讨论的问题。'],'#1e3a50','#f1f5f3','#5b9c8b','#dce8e3'],
  ['events','此刻策划','活动策划','让每场相聚都有意义','从主题构想到现场执行，呈现品牌活动、社区聚会与小型庆典的策划路径。','活动的核心是让人与人、人与内容真正相遇。','筹备线下体验的团队',['主题设计|明确活动目标、受众与核心体验。','流程编排|安排内容节奏、场地动线和参与方式。','现场协同|梳理分工、物料与当天的关键节点。'],'#3b2d48','#f7f2ef','#cb7e5c','#e5dbe8'],
  ['outdoor','野径装备','户外用品','走向户外，轻装出发','围绕徒步、露营与周末探索，整理装备类别和使用场景。','让装备选择回到真实的路线、天气与个人习惯。','准备走进自然的户外爱好者',['徒步装备|按路线长度与天气理解基础装备组合。','露营收纳|展示便携、耐用与易整理的用品思路。','出行指南|提供行前检查和户外使用的基本建议。'],'#2d4238','#f1f1e9','#c77d43','#dce5d9'],
  ['bookstore','页间书店','独立书店','在书页之间，发现新方向','用主题书单、阅读活动与空间介绍，构建一处愿意停留的阅读场所。','好书店让阅读成为人与想法相遇的日常。','喜欢阅读与交流的人',['主题书单|围绕生活、设计与人文组织阅读线索。','阅读活动|呈现分享会与小型聚会的活动形式。','空间介绍|展示安静阅读和自在交流的不同角落。'],'#3b414d','#f6f1e7','#bd7d58','#e8dfd2'],
  ['renewable','向阳能源','清洁能源','让能源选择更清晰','以易理解的方式介绍分布式能源、项目评估与长期运维的基本路径。','从场景和需求出发，讨论适合的能源方案。','探索低碳转型的组织',['场景评估|梳理用能特点、场地条件与项目目标。','方案设计|比较系统配置和实施阶段的关键问题。','运维观察|介绍运行数据与日常维护的关注点。'],'#23534d','#f1f6ef','#d6a23f','#dce9db'],
  ['health','安序健康','健康管理','把健康管理融入每一天','通过清晰的信息架构，展示生活方式支持、健康记录与服务流程。','持续的健康习惯始于可理解、可做到的小步骤。','希望建立健康生活习惯的人',['生活方式|围绕睡眠、运动与饮食提供基础信息。','健康记录|展示个人记录与阶段回顾的组织方式。','服务导航|帮助访客了解咨询前后的常见流程。'],'#235660','#f2f8f5','#73a99e','#dcece7'],
];

const steps = [
  { title: '了解需求', detail: '先讨论目标、使用场景与现有条件，明确真正需要解决的问题。' },
  { title: '形成方案', detail: '将信息整理成清晰的服务路径，让选择和重点一目了然。' },
  { title: '持续优化', detail: '根据反馈调整内容和体验，让方案随着需求一起成长。' },
];

for (const [index, row] of projects.entries()) {
  const [slug,name,industry,headline,intro,promise,audience,rawServices,ink,paper,accent,soft] = row;
  const id = `fleet-${slug}`;
  const dir = join(root, 'sites', id);
  if (existsSync(dir)) throw new Error(`${dir} already exists; refusing to overwrite a site`);
  mkdirSync(join(dir, 'src', 'pages'), { recursive: true });
  mkdirSync(join(dir, 'public'), { recursive: true });
  const content = { name, industry, eyebrow: `${industry} / 设计示例`, headline, intro, promise, audience,
    services: rawServices.map((service) => { const [title,detail] = service.split('|'); return { title,detail }; }),
    steps, about: `${name}是一个${industry}行业的网站概念。页面用简洁的叙事、明确的服务说明和易读的视觉层级，展示这一行业可以如何在线上表达自己的价值。`,
    palette: { ink,paper,accent,soft }, layout: index % 4 };
  writeFileSync(join(dir,'src','content.json'), JSON.stringify(content,null,2)+'\n');
  writeFileSync(join(dir,'src','pages','index.astro'), `---\nimport IndustryDemo from '@astro-fleet/shared-ui/src/layouts/IndustryDemo.astro';\nimport content from '../content.json';\n---\n<IndustryDemo {content} />\n`);
  writeFileSync(join(dir,'astro.config.mjs'), `import { defineConfig } from 'astro/config';\nexport default defineConfig({ site: 'https://${pagesHostnames[id] ?? `${id}.pages.dev`}', output: 'static' });\n`);
  writeFileSync(join(dir,'package.json'), JSON.stringify({name:id,version:'0.1.0',private:true,type:'module',scripts:{build:'astro build',dev:'astro dev',preview:'astro preview',lint:'astro check'},dependencies:{astro:'^6.1.7','@astro-fleet/shared-ui':'workspace:*','@astro-fleet/config':'workspace:*'},devDependencies:{'@astrojs/check':'^0.9',typescript:'^5'}},null,2)+'\n');
  writeFileSync(join(dir,'public','robots.txt'), 'User-agent: *\nDisallow: /\n');
  writeFileSync(join(dir,'public','favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${ink}"/><circle cx="32" cy="32" r="18" fill="${accent}"/></svg>\n`);
  writeFileSync(join(dir,'public','_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n');
  console.log(`${String(index+1).padStart(2,'0')} ${id} ${name}`);
}
