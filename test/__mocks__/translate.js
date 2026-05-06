module.exports = async (text, options = {}) => text;
module.exports.Translate = class Translate {
  constructor(opts = {}) {
    this.from = opts.from || "en";
    this.to = opts.to || "en";
  }
};
