// ====== 流云智炬 · 联系表单持久化云函数 ======
const cloudbase = require('@cloudbase/node-sdk');

exports.main = async (event) => {
  const { email, phone, message, source } = event;

  // 验证
  if (!message || message.trim().length < 10) {
    return { code: 400, msg: '需求描述至少10个字符' };
  }
  if (!email && !phone) {
    return { code: 400, msg: '至少填写邮箱或电话' };
  }

  try {
    const app = cloudbase.init({ env: 'cloud1-0ggg2niq36a70b37' });
    const db = app.database();

    await db.collection('contacts').add({
      email: email || '',
      phone: phone || '',
      message: message.trim(),
      source: source || 'website',
      createdAt: new Date().toISOString()
    });

    return { code: 200, msg: '提交成功' };
  } catch (e) {
    console.error('Contact persist error:', e);
    return { code: 500, msg: '服务器错误，请稍后重试' };
  }
};
