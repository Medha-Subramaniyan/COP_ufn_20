const app_name = '64.225.3.4'

function buildPath(route) {
    if (process.env.NODE_ENV !== 'development') {
        return 'http://' + app_name + ':5000/' + route;
    } else {
        return 'http://localhost:5000/' + route;
    }
}

export default buildPath;

