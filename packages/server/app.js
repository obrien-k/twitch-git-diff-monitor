const { send, json } = require("micro")
const range = require("lodash/range")
const execSync = require("child_process").execSync
var parse = require("parse-diff")

const repoPath = "/home/seve/workspace/os/twitch-git-diff-monitor"

module.exports = async (req, res) => {
  const output = execSync(`git diff`, {
    cwd: repoPath,
  }).toString()

  return send(res, 200, parse(output))
}
