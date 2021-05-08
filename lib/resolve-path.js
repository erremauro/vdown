const path = require('path')

module.exports = (filepath) => {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, path.resolve(filepath.slice(1)))
    }
    return path.resolve(filepath)
}