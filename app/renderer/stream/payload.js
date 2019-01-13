const payload = (id, type, data = {}) => {
  return JSON.stringify({
    id,
    jsonrpc: '2.0',
    method: type,
    params: [],
  });
};

module.exports = payload;
