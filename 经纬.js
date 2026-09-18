#!/usr/bin/env node
"use strict";

var 缺了 = "没法定位：缺了经纬度\n";
var 格式错 = "没法定位：请给出不带正号的整数角秒\n";
var 出界 = "没法定位：纬度要在正负九十度内，经度要在正负一百八十度内\n";

function 是整数(文本) {
  return /^-?[0-9]+$/.test(文本);
}

function 度分秒(总秒) {
  var 绝对 = Math.abs(总秒);
  var 度 = Math.floor(绝对 / 3600);
  var 分 = Math.floor((绝对 % 3600) / 60);
  var 秒 = 绝对 % 60;
  return 度 + "度" + 分 + "分" + 秒 + "秒";
}

function 主程序(参数) {
  if (参数.length !== 2 || 参数.indexOf("") !== -1 || 参数.indexOf("缺") !== -1) {
    process.stderr.write(缺了);
    return 2;
  }
  if (!是整数(参数[0]) || !是整数(参数[1])) {
    process.stderr.write(格式错);
    return 2;
  }
  var 纬 = Number(参数[0]);
  var 经 = Number(参数[1]);
  if (Math.abs(纬) > 90 * 3600 || Math.abs(经) > 180 * 3600) {
    process.stderr.write(出界);
    return 2;
  }
  var 纬名 = 纬 >= 0 ? "北纬" : "南纬";
  var 经名 = 经 >= 0 ? "东经" : "西经";
  process.stdout.write(纬名 + 度分秒(纬) + 经名 + 度分秒(经) + "\n");
  return 0;
}

if (require.main === module) {
  process.exitCode = 主程序(process.argv.slice(2));
}

module.exports = { 主程序: 主程序 };
