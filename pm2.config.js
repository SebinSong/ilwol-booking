module.exports = {
  apps : [{
    name   : "server",
    script : "./backend/server.js",
    instances: 0,
    out_file: "/dev/null",
    error_file: "/dev/null",
    log_file: "/dev/null"
  }]
}
