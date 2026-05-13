# Graph Report - AI知识库  (2026-05-14)

## Corpus Check
- Corpus is ~2,966 words - fits in a single context window. You may not need a graph.

## Summary
- 83 nodes · 140 edges · 14 communities (10 shown, 4 thin omitted)
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_核心团队与业务生态|核心团队与业务生态]]
- [[_COMMUNITY_套餐与行业解决方案|套餐与行业解决方案]]
- [[_COMMUNITY_竞争优势与定价原则|竞争优势与定价原则]]
- [[_COMMUNITY_AI知识库与智能客服|AI知识库与智能客服]]
- [[_COMMUNITY_小程序与售后服务|小程序与售后服务]]
- [[_COMMUNITY_高端套餐与组合|高端套餐与组合]]
- [[_COMMUNITY_网站服务与销售|网站服务与销售]]
- [[_COMMUNITY_合同条款与付款|合同条款与付款]]
- [[_COMMUNITY_入门级套餐|入门级套餐]]
- [[_COMMUNITY_服务流程与交付标准|服务流程与交付标准]]
- [[_COMMUNITY_客户关系管理|客户关系管理]]
- [[_COMMUNITY_全案定制服务|全案定制服务]]
- [[_COMMUNITY_AI内容生成|AI内容生成]]
- [[_COMMUNITY_AI数据分析|AI数据分析]]

## God Nodes (most connected - your core abstractions)
1. `三亚流云智炬科技工作室` - 31 edges
2. `网站开发服务` - 13 edges
3. `小程序开发服务` - 11 edges
4. `AI智能客服服务` - 8 edges
5. `行业功能包叠加模式` - 8 edges
6. `B1品牌版 (¥12,800)` - 7 edges
7. `售后服务体系（3个月免费+Bug修复+故障响应）` - 7 edges
8. `五条业务线交叉引流策略` - 7 edges
9. `源码交付` - 6 edges
10. `7步标准合作流程` - 6 edges

## Surprising Connections (you probably didn't know these)
- `B2专业版 (¥19,800)` --conceptually_related_to--> `CDN加速服务 (¥1,200/年)`  [INFERRED]
  AI知识库/02_网站套餐.md → AI知识库/06_增值服务价格表.md
- `行业功能包叠加模式` --semantically_similar_to--> `网站六档梯度定价策略`  [INFERRED] [semantically similar]
  AI知识库/04_行业解决方案.md → AI知识库/02_网站套餐.md
- `三亚流云智炬科技工作室` --offers--> `季度特惠活动`  [EXTRACTED]
  AI知识库/01_公司概述.md → AI知识库/05_组合优惠与促销.md
- `网站开发服务` --has_package--> `A1体验版 (¥3,800)`  [EXTRACTED]
  AI知识库/01_公司概述.md → AI知识库/02_网站套餐.md
- `网站开发服务` --has_package--> `C1集团版 (¥29,800)`  [EXTRACTED]
  AI知识库/01_公司概述.md → AI知识库/02_网站套餐.md

## Hyperedges (group relationships)
- **网站+小程序组合阶梯体系** — 05_组合优惠与促销_初创组合, 05_组合优惠与促销_成长组合, 05_组合优惠与促销_品牌组合, 05_组合优惠与促销_旗舰组合, 05_组合优惠与促销_全案定制 [EXTRACTED 1.00]
- **五条业务线交叉协同体系** — 13_推广分销业务_渔村梦想家, 01_公司概述_网站开发, 01_公司概述_小程序开发, 13_推广分销业务_大地保险推广分销, 13_推广分销业务_携程开放平台推广分销, 13_推广分销业务_运营商电话卡推广分销 [EXTRACTED 1.00]
- **服务交付流程体系（流程→验收→售后→回访→评价）** — 07_服务流程与工期_7步标准合作流程, 08_交付标准与售后_验收标准, 08_交付标准与售后_售后服务体系, 08_交付标准与售后_客户回访制度, 08_交付标准与售后_客户评价体系 [EXTRACTED 1.00]

## Communities (14 total, 4 thin omitted)

### Community 0 - "核心团队与业务生态"
Cohesion: 0.19
Nodes (17): UI/UX设计服务, 前端工程师, 后端工程师, 品质为本, 客户第一, 技术总监/创始人, 持续成长, 三亚流云智炬科技工作室 (+9 more)

### Community 1 - "套餐与行业解决方案"
Cohesion: 0.17
Nodes (15): A2初创版 (¥6,800), B1品牌版 (¥12,800), MP2基础功能版 (¥9,800), MP3电商标准版 (¥18,800), 企业服务行业解决方案 (功能包+¥3,000), 房产家装行业解决方案 (功能包+¥8,000), 行业功能包叠加模式, 酒店民宿行业解决方案 (功能包+¥5,000) (+7 more)

### Community 2 - "竞争优势与定价原则"
Cohesion: 0.2
Nodes (12): 免费售后3个月, 原创设计, 明码标价, 海南自贸港, 源码交付, 网站六档梯度定价策略, 小程序源码交付 vs SaaS年费制, 知识产权归属条款（源码归客户，CMS框架归乙方） (+4 more)

### Community 3 - "AI知识库与智能客服"
Cohesion: 0.43
Nodes (8): AI智能客服服务, AI智能客服专业版 (¥5,000/年, 200问答含意图识别), AI智能客服基础版 (¥2,000/年, 50问答), SaaS平台 vs 定制开发对比, AI客服行为准则（System Prompt）, CloudBase AI, Dify AI平台, 流云智炬AI知识库 V3.0

### Community 4 - "小程序与售后服务"
Cohesion: 0.4
Nodes (6): 小程序开发服务, MP5多商户平台版 (¥48,000+), 小程序基础维护 (¥2,400/年), 小程序高级维护 (¥6,000/年), 网站高级维护 (¥9,800/年), 售后服务体系（3个月免费+Bug修复+故障响应）

### Community 5 - "高端套餐与组合"
Cohesion: 0.4
Nodes (5): B2专业版 (¥19,800), C1集团版 (¥29,800), MP4电商专业版 (¥29,800), 旗舰组合 (B2+MP4, ¥42,000), 多语言增值服务 (¥6,000/语种)

### Community 6 - "网站服务与销售"
Cohesion: 0.5
Nodes (5): 网站开发服务, C2定制版 (¥50,000+), 老带新推荐机制, 网站基础维护 (¥3,600/年), 销售核心五问

### Community 7 - "合同条款与付款"
Cohesion: 0.67
Nodes (4): 保密协议, 小程序开发服务合同, 标准付款方案（50-50 / 40-30-30 / 30-30-20-20）, 网站开发服务合同

### Community 8 - "入门级套餐"
Cohesion: 0.67
Nodes (3): A1体验版 (¥3,800), MP1展示版 (¥5,800), 初创组合 (A1+MP1, ¥8,000)

### Community 9 - "服务流程与交付标准"
Cohesion: 0.67
Nodes (3): 7步标准合作流程, 项目管理节奏（日站会/周报/里程碑评审）, 项目验收标准（设计还原度≥95%）

## Knowledge Gaps
- **13 isolated node(s):** `UI/UX设计服务`, `设计总监`, `前端工程师`, `后端工程师`, `C2定制版 (¥50,000+)` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `三亚流云智炬科技工作室` connect `核心团队与业务生态` to `套餐与行业解决方案`, `竞争优势与定价原则`, `AI知识库与智能客服`, `小程序与售后服务`, `网站服务与销售`, `客户关系管理`?**
  _High betweenness centrality (0.599) - this node is a cross-community bridge._
- **Why does `网站开发服务` connect `网站服务与销售` to `核心团队与业务生态`, `套餐与行业解决方案`, `小程序与售后服务`, `高端套餐与组合`, `合同条款与付款`, `入门级套餐`, `服务流程与交付标准`?**
  _High betweenness centrality (0.272) - this node is a cross-community bridge._
- **Why does `小程序开发服务` connect `小程序与售后服务` to `核心团队与业务生态`, `套餐与行业解决方案`, `高端套餐与组合`, `合同条款与付款`, `入门级套餐`, `服务流程与交付标准`?**
  _High betweenness centrality (0.220) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AI智能客服服务` (e.g. with `Dify AI平台` and `CloudBase AI`) actually correct?**
  _`AI智能客服服务` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `UI/UX设计服务`, `设计总监`, `前端工程师` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._