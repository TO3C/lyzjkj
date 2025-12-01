# EmailJS 集成配置指南

本网站已集成 EmailJS 服务，用于处理客户联系表单的邮件发送。请按照以下步骤完成配置：

## 🚀 快速配置步骤

### 1. 注册 EmailJS 账号
- 访问 [EmailJS 官网](https://www.emailjs.com/)
- 点击 "Sign Up" 创建免费账号
- 验证邮箱并登录

### 2. 创建邮件服务
1. 登录后，进入 "Email Services" 页面
2. 点击 "Add New Service"
3. 选择邮件服务商（推荐 Gmail 或 Outlook）
4. 按照指引连接你的邮箱账号
5. 记录生成的 **Service ID**

### 3. 创建邮件模板
1. 进入 "Email Templates" 页面
2. 点击 "Create New Template"
3. 使用以下模板内容：

#### 模板名称：`工作室联系表单`
```
来自流云智炬科技工作室网站的新客户咨询

客户信息：
邮箱：{{email}}
电话：{{phone}}

详细需求：
{{message}}

---
发送时间：{{sent_at}}
```

4. 记录生成的 **Template ID**

### 4. 获取公钥
1. 进入 "Account" 页面
2. 找到 "Public Key" 部分
3. 复制公钥值

### 5. 配置网站代码
打开 `script.js` 文件，找到以下代码行并替换：

```javascript
// 第 28 行左右，替换为你的公钥
emailjs.init("YOUR_PUBLIC_KEY"); // 替换为你的实际公钥

// 第 50 行左右，替换服务ID和模板ID
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
```

替换为：
```javascript
emailjs.init("你的实际公钥");
emailjs.send('你的服务ID', '你的模板ID', formData)
```

## 📧 配置示例

假设你获得以下信息：
- Public Key: `abc123def456ghi789`
- Service ID: `service_gmail`
- Template ID: `template_contact`

配置后的代码应该是：
```javascript
emailjs.init("abc123def456ghi789");
emailjs.send('service_gmail', 'template_contact', formData)
```

## 🎯 邮件接收设置

### 使用你的 QQ 邮箱接收
- 服务创建时选择 "Gmail" 或其他支持的服务
- 在邮箱设置中，可以将邮件自动转发到 296077990@qq.com
- 或者直接在 EmailJS 中设置目标邮箱为 296077990@qq.com

### 企业微信通知（可选）
如果需要企业微信通知：
1. 在 EmailJS 模板中添加企业微信 Webhook URL
2. 或者使用 Zapier 等工具集成 EmailJS 和企业微信

## ✅ 测试配置

1. 完成配置后，在网站联系表单填写测试信息
2. 点击"发送消息"按钮
3. 检查指定邮箱是否收到邮件
4. 检查网站是否显示"发送成功"提示

## 🔧 常见问题

### 邮件发送失败
1. 检查公钥、服务ID、模板ID是否正确
2. 确认邮件服务已正确连接
3. 检查邮箱是否开启了接收限制

### 免费版限制
- EmailJS 免费版每月 200 封邮件
- 超出后需要升级到付费版
- 对于工作室规模通常足够使用

### 安全建议
1. 公钥是公开的，不会造成安全风险
2. 不要在前端代码中暴露私钥
3. 定期检查邮件发送日志

## 📞 技术支持

如需技术支持，请联系：
- EmailJS 官方文档：https://www.emailjs.com/docs/
- 工作室邮箱：296077990@qq.com

---

**配置完成后，删除此文件或将其移动到安全位置。**
