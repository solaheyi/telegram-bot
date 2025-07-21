// api/telegram-webhook.js (Vercel函数)
export default async function handler(req, res) {
  // 只处理POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const telegramData = req.body;

    // 检查是否有消息内容
    if (!telegramData.message || !telegramData.message.text) {
      return res.status(200).json({ status: 'ignored - no text message' });
    }

    const messageText = telegramData.message.text;
    const botUsername = '@user_may_assistant_bot'; // 替换为你的bot用户名

    // 只有包含@bot时才转发给Make.com
    if (messageText.includes(botUsername)) {
      console.log('转发消息到Make.com:', messageText);

      // 转发给Make.com webhook
      const makeWebhookUrl = 'https://hook.us2.make.com/dhkid5a99xim5gul6lwauxi7wwkevu4y';

      const response = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramData)
      });

      if (response.ok) {
        console.log('成功转发到Make.com');
        return res.status(200).json({ status: 'forwarded to make.com' });
      } else {
        console.error('转发到Make.com失败:', response.status);
        return res.status(500).json({ error: 'Failed to forward to make.com' });
      }
    } else {
      // 不包含@bot，直接忽略，不转发
      console.log('忽略消息（不包含@bot）:', messageText);
      return res.status(200).json({ status: 'ignored - no mention' });
    }

  } catch (error) {
    console.error('处理webhook时出错:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// 可选：添加安全验证
function verifyTelegramWebhook(req) {
  // 可以添加Telegram的secret token验证
  // const secretToken = req.headers['x-telegram-bot-api-secret-token'];
  // return secretToken === process.env.TELEGRAM_SECRET_TOKEN;
  return true;
}