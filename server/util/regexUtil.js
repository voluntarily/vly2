const escapeRegex = s => s.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&')

module.exports = escapeRegex
