# 📧 EmailJS 邮件模板代码

根据你的配置，这里是完整的EmailJS模板代码，可以直接复制到EmailJS后台使用：

## 🎯 方式一：标准HTML模板（推荐）

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>新客户咨询</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: #007bff;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            margin-bottom: 20px;
        }
        .field {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
        }
        .field-group {
            display: flex;
            gap: 15px;
        }
        .field-group input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            min-height: 100px;
            resize: vertical;
        }
        .button {
            background: #007bff;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .button:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 邮件模板测试</h1>
            <p>流云智炬科技工作室</p>
        </div>
        
        <div class="content">
            <h2>客户信息</h2>
            
            <div class="field">
                <label>客户姓名</label>
                <div class="field-group">
                    <input type="text" value="{{name}}" readonly>
                </div>
            </div>
            
            <div class="field">
                <label>客户邮箱</label>
                <div class="field-group">
                    <input type="email" value="{{email}}" readonly>
                </div>
            </div>
            
            <div class="field">
                <label>联系电话</label>
                <div class="field-group">
                    <input type="tel" value="{{phone}}" readonly>
                </div>
            </div>
            
            <div class="field">
                <label>详细需求</label>
                <div class="field-group">
                    <textarea readonly>{{message}}</textarea>
                </div>
            </div>
            
            <div class="button">测试发送</div>
        </div>
    </div>
</body>
</html>
```

## 🎯 方式二：纯文本模板（简单）

```text
客户邮箱：{{email}}
联系电话：{{phone}}

详细需求：
{{message}}

---
发送时间：{{sent_at}}
```

## 🎯 方式三：丰富HTML模板（带样式）

```html
来自流云智炬科技工作室网站的新客户咨询

<div style="background: #f8f9f; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h2 style="color: #333; margin-bottom: 20px;">📧 新客户咨询</h2>
    <div style="background: white; padding: 30px; border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">客户信息</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{{name}}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">客户邮箱</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{{email}}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">联系电话</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{{phone}}</td>
            </tr>
        </table>
        
        <h3 style="color: #333; margin-top: 30px;">详细需求</h3>
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee; margin-bottom: 20px;">
            {{message}}
        </div>
        
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
            ---
            发送时间：{{sent_at}}<br>
            发自：流云智炬科技工作室网站
        </p>
    </div>
</div>
```

## 🎯 EmailJS变量说明

在你的模板中可以使用以下变量：

- `{{email}}` - 客户邮箱
- `{{phone}}` - 客户电话  
- `{{message}}` - 客户需求描述
- `{{name}}` - 客户姓名（如果需要）
- `{{sent_at}}` - 发送时间（EmailJS自动添加）

## 📋 使用方法

1. **选择模板类型**：
   - 在EmailJS后台选择你喜欢的样式（HTML或纯文本）

2. **复制粘贴**：
   - 将上面的代码复制到EmailJS模板编辑器
   - 点击 "Save Changes"

3. **测试发送**：
   - 使用测试按钮验证模板格式
   - 确认变量正确显示

## 🔧 配置确认

你的EmailJS配置：
- **Service ID**: `service_pic12wf`
- **Template ID**: `template_j4ddbl6`
- **Public Key**: `SF1gQ4b50a6Q4Z9OX`

## 📞 代码与你的项目完全匹配！

你的JavaScript代码中：
```javascript
const formData = {
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    message: document.getElementById('message').value,
    to_email: '296077990@qq.com'
};
```

这些变量会自动映射到EmailJS模板中对应的占位符：
- `formData.email` → `{{email}}`
- `formData.phone` → `{{phone}}`
- `formData.message` → `{{message}}`

---

你的配置现在完全匹配！🎯

## 📊 需要帮助？

如果需要更新模板内容或有其他配置问题，请告诉我：
1. 你希望的模板格式
2. 需要添加的变量
3. 遇到的任何错误信息

我会帮你完善EmailJS配置！🎯✨
