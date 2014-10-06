require.config({
    baseUrl: '..',
    paths: {
        jquery: 'lib/jquery/dist/jquery.min',
        hogan: 'lib/hogan/web/builds/3.0.2/hogan-3.0.2.min.amd',
        hgn: 'lib/requirejs-hogan-plugin/hgn',
        text: 'lib/requirejs-hogan-plugin/text'
    },
    packages: [{
        name: 'stub',
        location: 'src'
    }],
    shim: {
        jquery: {
            exports: '$'
        }
    }
});