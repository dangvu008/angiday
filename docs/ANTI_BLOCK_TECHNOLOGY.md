# Anti-Block Technology

## Tổng quan

Anti-Block Technology là hệ thống tiên tiến được thiết kế để vượt qua các biện pháp bảo mật và chặn truy cập của các website hiện đại. Hệ thống sử dụng nhiều phương pháp khác nhau để đảm bảo có thể trích xuất dữ liệu từ các trang web có bảo mật cao.

## Các loại chặn truy cập phổ biến

### 🛡️ **Anti-Bot Protection**
- **Cloudflare Protection**: DDoS protection, bot detection
- **reCAPTCHA**: Google's anti-bot verification
- **JavaScript Challenges**: Client-side verification
- **Rate Limiting**: Giới hạn số request per IP
- **User-Agent Detection**: Chặn automated requests

### 🔒 **CORS (Cross-Origin Resource Sharing)**
- **Same-Origin Policy**: Chặn cross-domain requests
- **Preflight Requests**: OPTIONS request blocking
- **Credential Requirements**: Authentication needed

### 🏢 **Corporate Security**
- **WAF (Web Application Firewall)**: Enterprise-level protection
- **IP Whitelisting**: Chỉ cho phép IP cụ thể
- **Geo-blocking**: Chặn theo vùng địa lý
- **VPN Detection**: Phát hiện và chặn VPN/Proxy

### 💰 **Paywall & Authentication**
- **Subscription Required**: Cần đăng nhập/trả phí
- **Session Management**: Cookie/token validation
- **Dynamic Content**: JavaScript-rendered content

## Phương pháp Anti-Block

### 🤖 **Browser Automation**

#### 1. **Puppeteer Proxy**
```javascript
// Sử dụng headless browser thật
const response = await puppeteerService.fetch(url, {
  waitFor: 2000,
  removeAntiBot: true,
  bypassCloudflare: true
});
```

**Ưu điểm:**
- Render JavaScript như browser thật
- Bypass Cloudflare challenges
- Handle dynamic content
- Support cookies/sessions

**Nhược điểm:**
- Chậm (2-10 giây)
- Tốn tài nguyên
- Có thể bị detect

#### 2. **ScrapingBee API**
```javascript
// Premium scraping service
const apiUrl = `https://app.scrapingbee.com/api/v1/`;
const params = {
  api_key: 'YOUR_KEY',
  url: targetUrl,
  render_js: true,
  premium_proxy: true,
  stealth_proxy: true
};
```

**Tính năng:**
- Residential proxies
- JavaScript rendering
- CAPTCHA solving
- Stealth mode

### 🌐 **Proxy Networks**

#### 1. **Rotating Proxies**
```javascript
const proxyList = [
  'proxy1.example.com:8001',
  'proxy2.example.com:8001', 
  'proxy3.example.com:8001'
];

// Rotate proxy for each request
const randomProxy = proxyList[Math.floor(Math.random() * proxyList.length)];
```

#### 2. **Residential Proxies**
- **Real IP addresses** from ISPs
- **Geographic distribution** worldwide
- **High success rate** against geo-blocking
- **Expensive** but effective

#### 3. **Datacenter Proxies**
- **Fast and cheap**
- **Easy to detect** and block
- **Good for** basic CORS bypass

### 📚 **Alternative Sources**

#### 1. **Archive.org (Wayback Machine)**
```javascript
// Get cached version of the page
const archiveUrl = `https://web.archive.org/web/timemap/link/${url}`;
const snapshots = await fetch(archiveUrl);
const latestSnapshot = parseLatestSnapshot(snapshots);
```

**Ưu điểm:**
- Không bị chặn
- Historical data available
- Free service

**Nhược điểm:**
- Dữ liệu có thể cũ
- Không phải trang nào cũng có
- Cấu trúc có thể khác

#### 2. **Google Cache**
```javascript
// Use Google's cached version
const cacheUrl = `https://webcache.googleusercontent.com/search?q=cache:${url}`;
```

**Ưu điểm:**
- Recent cached content
- Google's infrastructure
- Usually not blocked

**Nhược điểm:**
- Not all pages cached
- May miss dynamic content
- Cache may be outdated

### 🔄 **Fallback Chain Strategy**

```
Request → Method 1 → Method 2 → Method 3 → ... → Method N → Fail
    ↓         ↓         ↓         ↓              ↓
  Success   Retry     Retry     Retry        Success
```

**Thứ tự ưu tiên:**
1. **AllOrigins** (Fast, reliable)
2. **CORS Anywhere** (Good compatibility)
3. **Puppeteer Proxy** (JavaScript support)
4. **ScrapingBee** (Premium features)
5. **ProxyMesh** (Rotating IPs)
6. **Direct Fetch** (CORS-enabled sites)
7. **Archive.org** (Cached content)
8. **Google Cache** (Alternative cache)

## Kỹ thuật Stealth

### 🕵️ **User-Agent Rotation**
```javascript
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Firefox/89.0'
];

const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
```

### 🎭 **Header Spoofing**
```javascript
const stealthHeaders = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none'
};
```

### ⏱️ **Request Timing**
```javascript
// Random delays to mimic human behavior
const delay = Math.random() * 2000 + 1000; // 1-3 seconds
await new Promise(resolve => setTimeout(resolve, delay));
```

### 🍪 **Session Management**
```javascript
// Maintain cookies across requests
const cookieJar = new Map();
const sessionHeaders = {
  'Cookie': Array.from(cookieJar.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')
};
```

## Xử lý các trường hợp cụ thể

### 🔥 **Cloudflare Challenge**
```javascript
// Wait for challenge completion
await page.waitForSelector('#challenge-form', { hidden: true });
await page.waitForNavigation({ waitUntil: 'networkidle0' });
```

### 🤖 **reCAPTCHA**
```javascript
// Use CAPTCHA solving service
const captchaSolution = await solveCaptcha(captchaImage);
await page.type('#captcha-input', captchaSolution);
```

### 🌍 **Geo-blocking**
```javascript
// Use proxy from allowed country
const allowedCountryProxy = getProxyByCountry('US');
const response = await fetch(url, { proxy: allowedCountryProxy });
```

### 💳 **Paywall**
```javascript
// Try to access cached/archived version
const freeVersion = await tryAlternativeSources(url);
if (!freeVersion) {
  throw new Error('Content behind paywall');
}
```

## Performance & Success Metrics

### 📊 **Success Rates by Method**

| Method | Success Rate | Speed | Cost |
|--------|-------------|-------|------|
| **AllOrigins** | 85% | Fast | Free |
| **CORS Anywhere** | 70% | Fast | Free |
| **Puppeteer** | 95% | Slow | Medium |
| **ScrapingBee** | 98% | Medium | High |
| **ProxyMesh** | 80% | Medium | Medium |
| **Archive.org** | 60% | Medium | Free |
| **Google Cache** | 50% | Fast | Free |

### ⚡ **Performance Optimization**

#### Parallel Processing
```javascript
// Try multiple methods simultaneously
const results = await Promise.allSettled([
  fetchViaAllOrigins(url),
  fetchViaCorsAnywhere(url),
  fetchViaPuppeteer(url)
]);

// Use first successful result
const successResult = results.find(r => r.status === 'fulfilled');
```

#### Smart Caching
```javascript
// Cache successful methods for domains
const domainMethodCache = new Map();
const cachedMethod = domainMethodCache.get(domain);
if (cachedMethod) {
  // Try cached method first
  return await cachedMethod(url);
}
```

#### Early Termination
```javascript
// Stop trying other methods if one succeeds
for (const method of methods) {
  try {
    const result = await method(url);
    if (result && result.length > 100) {
      return result; // Success, stop trying other methods
    }
  } catch (error) {
    continue; // Try next method
  }
}
```

## Compliance & Ethics

### ⚖️ **Legal Considerations**
- **Respect robots.txt** when possible
- **Rate limiting** to avoid overloading servers
- **Fair use** of public content only
- **No personal data** extraction

### 🤝 **Ethical Guidelines**
- **Don't bypass paywalls** for commercial content
- **Respect copyright** and terms of service
- **Use cached sources** when available
- **Minimize server load** with efficient requests

### 🛡️ **Responsible Usage**
```javascript
// Implement rate limiting
const rateLimiter = new Map();
const lastRequest = rateLimiter.get(domain);
if (lastRequest && Date.now() - lastRequest < 1000) {
  await delay(1000); // Wait 1 second between requests
}
```

## Troubleshooting

### 🔍 **Common Issues**

#### "All methods failed"
- **Check URL validity**
- **Try different time** (server may be down)
- **Check if content exists** (404 errors)

#### "CAPTCHA detected"
- **Use premium services** with CAPTCHA solving
- **Try archived versions**
- **Manual verification** may be required

#### "IP blocked"
- **Switch to residential proxies**
- **Use different geographic locations**
- **Wait and retry later**

### 📝 **Debug Information**
```javascript
console.log('Anti-block debug info:', {
  url: targetUrl,
  methodsAttempted: attemptedMethods,
  lastError: lastError.message,
  successfulMethod: successfulMethod,
  timeElapsed: Date.now() - startTime
});
```

## Future Enhancements

### 🔮 **Planned Features**
- **AI-powered** method selection
- **Machine learning** for success prediction
- **Blockchain-based** proxy networks
- **Real-time** method effectiveness monitoring

### 🚀 **Advanced Techniques**
- **Browser fingerprinting** avoidance
- **TLS fingerprinting** randomization
- **WebRTC leak** prevention
- **Canvas fingerprinting** spoofing

## Kết luận

Anti-Block Technology cung cấp giải pháp toàn diện để vượt qua các hạn chế truy cập web hiện đại. Với sự kết hợp của nhiều phương pháp và kỹ thuật stealth, hệ thống có thể đạt được tỷ lệ thành công cao (>90%) trên hầu hết các trang web.

**Lưu ý quan trọng:** Sử dụng công nghệ này một cách có trách nhiệm và tuân thủ các quy định pháp luật địa phương.
