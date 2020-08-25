const path = require('path');

module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    const dir = path.resolve(__dirname, 'src/assets/icons');//说明SVG的目录，__dirname指当前目录

    //配置loader
    config.module
      .rule('svg-sprite')  //添加一个规则
      .test(/\.svg$/)  //这个规则的特点：文件如果能匹配这个以.svg结尾的正则，我就要用这个规则
      .include.add(dir).end()  //但是不是整个项目下的.svg文件都要匹配，这里是设置只匹配dir目录下的
      .use('svg-sprite-loader').loader('svg-sprite-loader').options({extract: false}).end();
    //设置要使用哪些loader；extract:false就是不要把它解析出文件，我不需要文件


    //配置插件
    config.plugin('svg-sprite').use(require('svg-sprite-loader/plugin'), [{plainSprite: true}]);
    config.module.rule('svg').exclude.add(dir); //其他svg loader 就不用管这个 icons 目录了

  }
};
