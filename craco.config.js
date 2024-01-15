const path = require('path')

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            paths.appBuild = webpackConfig.output.path = path.resolve(
                'unofficial-flex-extension'
            )
            return {
                ...webpackConfig,
                entry: {
                    main: [
                        env === 'development' &&
                            require.resolve(
                                'react-dev-utils/webpackHotDevClient'
                            ),
                        paths.appIndexJs,
                    ].filter(Boolean),
                    content: './src/chrome/content.ts',
                },
                output: {
                    ...webpackConfig.output,
                    filename: 'static/js/[name].js',
                },
                optimization: {
                    ...webpackConfig.optimization,
                    runtimeChunk: false,
                },
            }
        },
    },
}
