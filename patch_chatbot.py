#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Patch the minified JS/CSS to add AI customer service chatbot widget."""

import re

JS_PATH = "/Users/j/Desktop/流云智炬官网/assets/index-Cg8uty_5.js"
CSS_PATH = "/Users/j/Desktop/流云智炬官网/assets/index-BefyIYpt.css"

# ============================================================
# Part 1: JS Injection
# ============================================================

with open(JS_PATH, "r", encoding="utf-8") as f:
    content = f.read()

print(f"Original JS size: {len(content)} chars")

# --- The chatbot component (zir function) ---
# This must be valid minified JS compatible with the existing code.
# Uses: _ (React hooks), k (jsx runtime), fr (service data), ir (footer styles)
chatbot_component = r"""function zir(){let[open,setOpen]=(0,_.useState)(!1);let[messages,setMessages]=(0,_.useState)([{text:`您好！我是流云智炬AI客服🤖\n\n我可以回答您关于网站开发、小程序开发、AI客服的常见问题。\n\n有什么问题请问我吧！`,isUser:!1}]);let[inputValue,setInputValue]=(0,_.useState)('');let messagesEndRef=(0,_.useRef)(null);let kbRef=(0,_.useRef)(null);(0,_.useEffect)(()=>{if(messagesEndRef.current){messagesEndRef.current.scrollIntoView({behavior:'smooth'})}},[messages]);function buildKB(){if(kbRef.current)return kbRef.current;let kb=[];let stopWords=['的','了','吗','呢','啊','我','你','他','她','它','们','是','有','可以','能','会','要','想','怎么','怎样','什么','哪里','如何','请问','一下','应该','需要','是否','帮忙'];function extractWords(text){let words=text.match(/[\u4e00-\u9fa5a-zA-Z0-9]+/g)||[];return words.filter(w=>!stopWords.includes(w.toLowerCase())&&w.length>0)}if(fr&&fr['服务']){for(let s of fr['服务']){if(s.detail&&s.detail.faq){for(let f of s.detail.faq){kb.push({question:f.q,answer:f.a,keywords:extractWords(f.q+' '+f.a)})}}if(s.detail&&s.name){kb.push({question:s.name,answer:`${s.emoji||''} ${s.name}: ${s.text||''}\n\n${s.detail.overview||''}`,keywords:extractWords(s.name+' '+s.text+' '+(s.detail.overview||''))})}}}kb.push({question:'联系方式',answer:`流云智炬联系方式：\n- 微信：Lyzjkj（已复制）\n- 电话：13876597418\n- 邮箱：296077990@qq.com\n- 地址：海南省三亚市崖州湾科技城\n\n添加微信请备注"来意"，我们会尽快回复您。`,keywords:extractWords('联系方式 微信 电话 邮箱 地址 咨询 联系我们 怎么联系 在哪里')});kb.push({question:'价格',answer:`我们的套餐价格：\n- 网站开发：¥3,800起（6档套餐：基础展示→全案定制）\n- 小程序开发：¥5,800起（5档套餐：基础模板→定制旗舰）\n- AI智能客服：免费赠送（B1及以上套餐），独立部署¥2,000/年起\n\n具体价格根据需求复杂度会有所调整，添加微信 Lyzjkj 可以获取免费报价。`,keywords:extractWords('价格 多少钱 报价 收费 费用 怎么收费 套餐 预算')});kb.push({question:'开发周期',answer:`各服务开发周期：\n- 网站开发：7个工作日上线（6步流程：需求→设计→开发→对接→测试→交付）\n- 小程序开发：10-20个工作日（含微信审核1-7天）\n- AI智能客服：3-5个工作日部署上线\n\n紧急项目可加急处理，请添加微信 Lyzjkj 沟通。`,keywords:extractWords('开发周期 多久 时间 工期 上线 几天 进度')});kb.push({question:'售后',answer:`我们提供完善的售后保障：\n- 套餐内包含1-2年免费维护\n- 3个月免费技术支持（所有套餐）\n- 超出免费期后¥500/月维护费\n- 小改动免费，大迭代按人天报价\n- 设计阶段不满意全额退款\n- 开发阶段按完成比例退款`,keywords:extractWords('售后 维护 保修 退款 不满意 支持 后续 修改')});kbRef.current=kb;return kb}function extractWords(text){let stopWords=['的','了','吗','呢','啊','我','你','他','她','它','们','是','有','可以','能','会','要','想','怎么','怎样','什么','哪里','如何','请问','一下','应该','需要','是否','帮忙'];let words=text.match(/[\u4e00-\u9fa5a-zA-Z0-9]+/g)||[];return words.filter(w=>!stopWords.includes(w.toLowerCase())&&w.length>0)}function calculateScore(userWords,entryKeywords){let score=0;for(let word of userWords){for(let k of entryKeywords){if(k.includes(word)||word.includes(k)){score+=1;if(k===word)score+=0.5;break}}}return score/Math.max(userWords.length,1)}function findBestAnswer(query){let kb=buildKB();let userWords=extractWords(query);if(!userWords.length)return{answer:`您好！请问有什么可以帮您的？\n\n您可以问我关于：\n- 网站开发、小程序开发、AI客服\n- 价格、开发周期、售后服务\n- 联系方式等`,score:0,isFallback:!1};let bestScore=0;let bestEntry=kb[0];for(let entry of kb){let score=calculateScore(userWords,entry.keywords);if(score>bestScore){bestScore=score;bestEntry=entry}}if(bestScore<0.15){return{answer:`抱歉，我不太确定您的问题。您可以：\n\n1. 添加微信 Lyzjkj 直接咨询（微信号已复制）\n2. 拨打：13876597418\n3. 发送邮件：296077990@qq.com`,score:0,isFallback:!0}}return{answer:bestEntry.answer,score:bestScore,isFallback:!1}}function handleSend(){if(!inputValue.trim())return;let query=inputValue.trim();setMessages(prev=>[...prev,{text:query,isUser:!0}]);setInputValue('');setTimeout(()=>{let result=findBestAnswer(query);setMessages(prev=>[...prev,{text:result.answer,isUser:!1}]);if(result.isFallback){try{navigator.clipboard&&navigator.clipboard.writeText('Lyzjkj')}catch{}}},500+Math.random()*400)}function handleKeyDown(e){if(e.key==='Enter')handleSend()}return(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(`button`,{className:`_chat_bubble ${open?'_chat_hidden':''}`,onClick:()=>setOpen(!open),'aria-label':'AI客服',children:(0,k.jsx)(`span`,{children:'🤖'})}),open?(0,k.jsxs)(`div`,{className:`_chat_window`,children:[(0,k.jsxs)(`div`,{className:`_chat_header`,children:[(0,k.jsx)(`span`,{children:'🤖 流云智炬AI客服'}),(0,k.jsx)(`button`,{className:`_chat_close`,onClick:()=>setOpen(!1),children:'✕'})]}),(0,k.jsxs)(`div`,{className:`_chat_messages`,children:[messages.map((msg,idx)=>(0,k.jsx)(`div`,{className:`_chat_msg ${msg.isUser?'_chat_user':'_chat_bot'}`,children:(0,k.jsx)(`div`,{children:msg.text})},idx)),(0,k.jsx)(`div`,{ref:messagesEndRef})]}),(0,k.jsxs)(`div`,{className:`_chat_input_wrap`,children:[(0,k.jsx)(`input`,{className:`_chat_input`,type:'text',placeholder:'输入问题...',value:inputValue,onChange:e=>setInputValue(e.target.value),onKeyDown:handleKeyDown}),(0,k.jsx)(`button`,{className:`_chat_send`,onClick:handleSend,disabled:!inputValue.trim(),children:'发送'})]}])]):null]})}"""

# --- Injection Point A: Insert zir() function after ar() before var or ---
pattern_a = "})}var or={c:"
replacement_a = "})}" + chatbot_component + "var or={c:"

count_a = content.count(pattern_a)
print(f"Injection Point A (after ar, before var or): found {count_a} occurrences")
if count_a == 1:
    content = content.replace(pattern_a, replacement_a)
    print("✓ Chatbot component injected after ar()")
else:
    print(f"✗ Unexpected count: {count_a}, aborting")
    exit(1)

# --- Injection Point B: Register zir() in Cr() root component ---
pattern_b = "(0,k.jsx)(ar,{})]})}"
replacement_b = "(0,k.jsx)(ar,{}),(0,k.jsx)(zir,{})]})}"

count_b = content.count(pattern_b)
print(f"Injection Point B (Cr root component): found {count_b} occurrences")
if count_b == 1:
    content = content.replace(pattern_b, replacement_b)
    print("✓ Chatbot component registered in Cr()")
else:
    print(f"✗ Unexpected count: {count_b}, aborting")
    exit(1)

# Write modified JS
with open(JS_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Modified JS size: {len(content)} chars")
print("✓ JS file updated successfully")

# ============================================================
# Part 2: CSS Injection
# ============================================================

with open(CSS_PATH, "r", encoding="utf-8") as f:
    css_content = f.read()

print(f"\nOriginal CSS size: {len(css_content)} chars")

chatbot_css = """
/* === AI Customer Service Chatbot === */
._chat_bubble {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #3b82f6;
  border: 2px solid #ffffff;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.35);
  cursor: pointer;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  transition: all .3s cubic-bezier(.16,1,.3,1);
  animation: _chatPulse 2s infinite;
}
._chat_bubble:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(59, 130, 246, 0.45);
}
._chat_bubble._chat_hidden {
  opacity: 0;
  pointer-events: none;
  transform: scale(0.8);
}
@keyframes _chatPulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(59, 130, 246, 0.35); }
  50% { box-shadow: 0 4px 32px rgba(59, 130, 246, 0.55); }
}
._chat_window {
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 380px;
  height: 520px;
  max-width: 90vw;
  max-height: 80vh;
  background: rgba(255, 255, 255, 0.95);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  backdrop-filter: blur(28px) saturate(160%);
  border: 1.2px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12), inset 0 1px rgba(255, 255, 255, 0.9);
  z-index: 9998;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: _chatSlideIn .3s cubic-bezier(.16,1,.3,1);
}
@keyframes _chatSlideIn {
  0% { opacity: 0; transform: translateY(20px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
._chat_header {
  padding: 14px 20px;
  background: linear-gradient(135deg, #3b82f6, #4fd1c5);
  color: #ffffff;
  font-weight: 600;
  font-size: .95rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}
._chat_close {
  background: transparent;
  border: 0;
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  line-height: 1;
  opacity: 0.8;
  transition: opacity .2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
._chat_close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
}
._chat_messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f8fafc;
}
._chat_messages::-webkit-scrollbar {
  width: 4px;
}
._chat_messages::-webkit-scrollbar-track {
  background: transparent;
}
._chat_messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
._chat_msg {
  max-width: 85%;
  animation: _chatFadeIn .25s ease-out;
}
@keyframes _chatFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
._chat_msg div {
  padding: 10px 14px;
  border-radius: 14px;
  line-height: 1.6;
  font-size: .85rem;
  white-space: pre-line;
  word-break: break-word;
}
._chat_user {
  margin-left: auto;
}
._chat_user div {
  background: #3b82f6;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}
._chat_bot {
  margin-right: auto;
}
._chat_bot div {
  background: #ffffff;
  color: #1e293b;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
._chat_input_wrap {
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
  gap: 8px;
  background: #ffffff;
  flex-shrink: 0;
}
._chat_input {
  flex: 1;
  border: 1.5px solid #e2e8f0;
  border-radius: 24px;
  padding: 10px 16px;
  font-size: .85rem;
  font-family: inherit;
  outline: none;
  transition: border-color .2s;
  background: #f8fafc;
}
._chat_input:focus {
  border-color: #3b82f6;
  background: #ffffff;
}
._chat_send {
  background: #3b82f6;
  color: #ffffff;
  border: 0;
  border-radius: 24px;
  padding: 10px 20px;
  font-size: .85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
  font-family: inherit;
  white-space: nowrap;
}
._chat_send:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}
._chat_send:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
@media (width <= 480px) {
  ._chat_bubble {
    width: 52px;
    height: 52px;
    bottom: 16px;
    right: 16px;
    font-size: 24px;
  }
  ._chat_window {
    bottom: 80px;
    right: 16px;
    width: calc(100vw - 32px);
    height: 65vh;
    max-height: 65vh;
    border-radius: 14px;
  }
  ._chat_header {
    padding: 12px 16px;
    font-size: .88rem;
  }
  ._chat_messages {
    padding: 12px;
    gap: 8px;
  }
  ._chat_msg div {
    font-size: .82rem;
    padding: 8px 12px;
  }
  ._chat_input_wrap {
    padding: 10px 12px;
  }
  ._chat_input {
    padding: 8px 14px;
    font-size: .82rem;
  }
  ._chat_send {
    padding: 8px 16px;
    font-size: .82rem;
  }
}
"""

css_content += chatbot_css

with open(CSS_PATH, "w", encoding="utf-8") as f:
    f.write(css_content)

print(f"Modified CSS size: {len(css_content)} chars")
print("✓ CSS file updated successfully")

# ============================================================
# Part 3: Verification
# ============================================================

print("\n=== Verification ===")
# Check that the patterns were replaced
with open(JS_PATH, "r", encoding="utf-8") as f:
    verify_js = f.read()

# Check that zir() function exists
assert "function zir()" in verify_js, "✗ zir() function not found in JS!"
print("✓ zir() function found in JS")

# Check that zir is registered in Cr()
assert "(0,k.jsx)(zir,{})" in verify_js, "✗ zir not registered in Cr()!"
print("✓ zir registered in Cr()")

# Check that original patterns are gone
assert pattern_a not in verify_js, "✗ Old pattern A still exists!"
print("✓ Pattern A replaced successfully")
assert pattern_b not in verify_js, "✗ Old pattern B still exists!"
print("✓ Pattern B replaced successfully")

# Check CSS
with open(CSS_PATH, "r", encoding="utf-8") as f:
    verify_css = f.read()
assert "_chat_bubble" in verify_css, "✗ Chat bubble CSS not found!"
print("✓ Chat CSS found")

print("\n🎉 All checks passed! Chatbot injection complete.")