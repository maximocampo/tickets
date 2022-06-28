exports.onCreateWebpackConfig = ({
    stage,
    actions,
    getConfig
}) => {
    if (stage === 'build-html') {
        actions.setWebpackConfig({
            externals: getConfig().externals.concat(function(context, request, callback) {
                const regex = /^@?firebase(\/(.+))?/;
                if (regex.test(request)) {
                    return callback(null, 'umd ' + request);
                }
                callback();
            })
        });
    }
};

exports.onCreatePage = async ({ page, actions }) => {
    const { createPage } = actions
    
    // page.matchPath is a special key that's used for matching pages
    // only on the client.
    if (page.path.match(/^\/goma5/)) {
        page.matchPath = "/goma5/:id"
    
        // Update the page.
        createPage(page)
    }
    
    if (page.path.match(/^\/tuentrada/)) {
        page.matchPath = "/tuentrada/:id"
    
        // Update the page.
        createPage(page)
    }
}
