#!/usr/bin/env node
"use strict";

var 缺了 = "没法定位：缺了经纬度\n";
var 格式错 = "没法定位：请给出不带正号的整数角秒\n";
var 公里负 = "没法定位：公里数不能是负的\n";
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

function 在界内(纬, 经) {
  return Math.abs(纬) <= 90 * 3600 && Math.abs(经) <= 180 * 3600;
}

function 主程序(参数) {
  if ((参数.length !== 2 && 参数.length !== 5) || 参数.indexOf("") !== -1 || 参数.indexOf("缺") !== -1) {
    process.stderr.write(缺了);
    return 2;
  }
  for (var 序 = 0; 序 < 参数.length; 序++) {
    if (!是整数(参数[序])) {
      process.stderr.write(格式错);
      return 2;
    }
  }
  if (参数.length === 5 && 参数[4].charAt(0) === "-") {
    process.stderr.write(公里负);
    return 2;
  }
  var 纬 = Number(参数[0]);
  var 经 = Number(参数[1]);
  if (参数.length === 2) {
    if (!在界内(纬, 经)) {
      process.stderr.write(出界);
      return 2;
    }
    var 纬名 = 纬 >= 0 ? "北纬" : "南纬";
    var 经名 = 经 >= 0 ? "东经" : "西经";
    process.stdout.write(纬名 + 度分秒(纬) + 经名 + 度分秒(经) + "\n");
    return 0;
  }
  var 纬二 = Number(参数[2]);
  var 经二 = Number(参数[3]);
  var 给定公里 = Number(参数[4]);
  if (!在界内(纬, 经) || !在界内(纬二, 经二)) {
    process.stderr.write(出界);
    return 2;
  }
  var 纬差 = Math.abs(纬 - 纬二);
  var 经差 = Math.abs(经 - 经二);
  var 平均纬 = Math.floor((Math.abs(纬) + Math.abs(纬二)) / 2);
  var 系数 = 平均纬 < 108000 ? 100 : (平均纬 < 216000 ? 87 : 50);
  var 米数 = 纬差 * 31 + Math.floor(经差 * 31 * 系数 / 100);
  var 公里 = Math.floor(米数 / 1000);
  process.stdout.write((公里 > 给定公里 ? "超过" : "没超过") + "\n");
  return 0;
}

if (require.main === module) {
  process.exitCode = 主程序(process.argv.slice(2));
}

module.exports = { 主程序: 主程序 };
