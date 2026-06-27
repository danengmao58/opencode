const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'gitdemo-'));
fs.writeFileSync(path.join(d, 'file.txt'), 'original\n');
execSync('git init -q', { cwd: d });
execSync('git add .', { cwd: d });
execSync('git commit -q --allow-empty-message -m "init"', { cwd: d });
fs.writeFileSync(path.join(d, 'file.txt'), 'changed\n');
const status = execSync('git status --porcelain=v1 -z -- .', { cwd: d });
const diff = execSync('git diff --no-ext-diff --name-status -z HEAD -- .', { cwd: d });
console.log('STATUS RAW', JSON.stringify(status.toString('utf8')));
console.log('STATUS TOKENS', status.toString('utf8').split('\0'));
console.log('DIFF RAW', JSON.stringify(diff.toString('utf8')));
console.log('DIFF TOKENS', diff.toString('utf8').split('\0'));
function kind(code){ if(code==='??') return 'added'; if(code.includes('U')) return 'modified'; if(code.includes('A') && !code.includes('D')) return 'added'; if(code.includes('D') && !code.includes('A')) return 'deleted'; return 'modified'; }
function isRenameOrCopy(code){ return code.startsWith('R') || code.startsWith('C'); }
function parseStatus(list){ const out=[]; for(let idx=0; idx<list.length; idx++){ const item=list[idx]; if(!item||item.length<3) continue; const code=item.slice(0,2); const file=item.slice(3); if(isRenameOrCopy(code)){ if(file){ out.push({ file, code, status: kind(code) }); idx += 1; continue; } const next=list[idx + 1]; if(!next) break; out.push({ file: next, code, status: kind(code) }); idx += 1; continue; } if(!file) continue; out.push({ file, code, status: kind(code) }); } return out; }
function parseNameStatus(list){ const out=[]; for(let idx=0; idx<list.length; idx++){ const code=list[idx]; if(!code) continue; if(isRenameOrCopy(code)){ const file=list[idx + 2]; if(!file) break; out.push({ file, code, status: kind(code) }); idx += 2; continue; } const file=list[idx + 1]; if(!file) break; out.push({ file, code, status: kind(code) }); idx += 1; } return out; }
console.log('PARSED STATUS', parseStatus(status.toString('utf8').split('\0')));
console.log('PARSED DIFF', parseNameStatus(diff.toString('utf8').split('\0')));
