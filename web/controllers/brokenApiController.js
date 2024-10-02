// controllers/brokenApiController.js
const vm = require('vm');

const brokenApi = {
  runUserCode: function(req, res) {
    const userInput = req.body.code;
    const sandbox = { result: null };
    try {
      vm.runInNewContext(`result = ${userInput}`, sandbox);
      res.json({ result: sandbox.result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  
  dynamicRequire: function(req, res) {
    const moduleName = req.body.module;
    try {
      const module = require(moduleName);
      res.json({ module: 'Module loaded successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

 
};

module.exports = brokenApi;