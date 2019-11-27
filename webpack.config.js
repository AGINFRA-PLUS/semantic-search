const path = require('path');
var autoprefixer = require('autoprefixer');
module.exports = {
    entry: ["@babel/polyfill", __dirname + '/src/forBuild.js'],
    devtool: 'source-map',
    output: {
        path: __dirname + '/dist',
        filename: 'search.js',
        library: 'search',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devServer: {
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i, 
                exclude: /node_modules/,
                loader: 'file-loader?name=images/[name].[ext]'
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                //Inlcude only 3rd party css that needs to be scoped globally to use
                //css-loader with modules disabled
                include: [
                    path.resolve('src/App.css')
                ],
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1
                        },
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            // Necessary for external CSS imports to work
                            // https://github.com/facebookincubator/create-react-app/issues/2677
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9', // React doesn't support IE8 anyway
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ],
                        },
                    },
                ],
            }
        ]
    }
};