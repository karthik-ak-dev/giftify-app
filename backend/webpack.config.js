const path = require('path');

module.exports = {
    entry: './src/app.ts',
    target: 'node',
    mode: 'production',
    externals: {
        'aws-sdk': 'aws-sdk'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js'
    }
}; 