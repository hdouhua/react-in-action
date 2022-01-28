// const webpack = require('webpack')

const DevMode = true

module.exports = {
    entry: {
        // main: './index.js'
        main: './main.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        // 一个 preset 包含若干个 plugins
                        // plugins: ["@babel/plugin-transform-react-jsx"]
                        plugins: [["@babel/plugin-transform-react-jsx", { pragma: 'createElement' }]],
                    }
                },
            }
        ]
    },
    devtool: DevMode ? 'eval-source-map': 'source-map',
    mode: DevMode ? 'development': 'production',
    optimization: {
        minimize: false,
    }

}