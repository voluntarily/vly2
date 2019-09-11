const path = require('path');

module.exports = async ({ config, mode, defaultConfig }) => {

  config.module.rules.push({
      loader: 'babel-loader',
      exclude: /node_modules/,
      test: /\.(js|jsx)$/,
      options: {
          presets: ['@babel/react'],
          plugins: [
              ['import', {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true
              }]
          ]
      },
  });

  config.module.rules.push({
      test: /\.less$/,
      loaders: [
          'style-loader',
          'css-loader',
          
          {
              loader: 'less-loader',
              options: {
                  modifyVars: {
                      'primary-color': '#6549AA',
                      'font-family' : 'Inter, -apple-system, Helvetica, Arial, sans-serif'
                    },
                  javascriptEnabled: true
              }
          }
      ],
      include: [
        path.resolve(__dirname, '../src'),
        /[\\/]node_modules[\\/].*antd/,
        path.resolve(__dirname, '../assets')
        

      ]
  });



  return config;
};