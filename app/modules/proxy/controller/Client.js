import { createRequire } from 'module';
import { Controller, helper } from "chanjs"; 

const require = createRequire(import.meta.url);
const { default: IP2Region } = require('ip2region');
const { getIp } = helper; 
const searcher = new IP2Region(); 

class ClientController extends Controller { 
  #getIpInfo(ip, data = {}) { 
    return { 
      status: "success", 
      country: data.country || "未知", 
      countryCode: data.countryCode || "CN", 
      region: data.region || "未知", 
      regionName: data.regionName || "未知", 
      city: data.city || "未知", 
      district: "", 
      zip: "", 
      lat: data.lat || "0.0", 
      lon: data.lon || "0.0", 
      timezone: data.timezone || "Asia/Shanghai", 
      isp: data.isp || "未知", 
      org: data.org || "", 
      as: data.as || "未知", 
      query: ip 
    }; 
  } 

  async ip(req, res) { 
    const targetIP = req.query.ip || getIp(req); 
    if (!targetIP) return this.fail("无法获取IP地址"); 

    const isInner = targetIP === "::1" || targetIP === "127.0.0.1" || /^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^192\.168\./.test(targetIP); 
    
    if (isInner) { 
      const data = this.#getIpInfo(targetIP, { 
        country: "内网", countryCode: "CN", 
        region: "内网", regionName: "内网", city: "内网", isp: "内网", as: "内网" 
      }); 
      return res.json(this.success({ data })); 
    } 

    const geo = searcher.search(targetIP); 
    if (geo) { 
      const data = this.#getIpInfo(targetIP, { 
        country: "中国", 
        countryCode: "CN", 
        region: geo.province || "未知", 
        regionName: geo.province || "未知", 
        city: geo.city || "未知", 
        isp: geo.isp || "未知", 
        as: geo.isp || "未知" 
      }); 
      return res.json(this.success({ data })); 
    } 

    const data = this.#getIpInfo(targetIP, {}); 
    return res.json(this.success({ data })); 
  } 
} 

export default new ClientController();