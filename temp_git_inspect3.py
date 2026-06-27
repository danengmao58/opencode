import os
import tempfile
import subprocess

for scenario in ['modified', 'rename', 'untracked']:
    d = tempfile.mkdtemp(prefix=f'gitdemo-{scenario}-')
    print('SCENARIO', scenario, 'DIR', d)
    with open(os.path.join(d, 'file.txt'), 'w', encoding='utf8') as f:
        f.write('original\n')
    subprocess.run(['git', 'init', '-q'], cwd=d, check=True)
    subprocess.run(['git', 'add', '.'], cwd=d, check=True)
    subprocess.run(['git', 'commit', '-q', '--allow-empty-message', '-m', 'init'], cwd=d, check=True)
    if scenario == 'modified':
        with open(os.path.join(d, 'file.txt'), 'w', encoding='utf8') as f:
            f.write('changed\n')
    elif scenario == 'rename':
        subprocess.run(['git', 'mv', 'file.txt', 'new.txt'], cwd=d, check=True)
    elif scenario == 'untracked':
        with open(os.path.join(d, 'untracked.txt'), 'w', encoding='utf8') as f:
            f.write('hello\n')
    status = subprocess.run(['git', 'status', '--porcelain=v1', '-z'], cwd=d, check=True, capture_output=True)
    print('STATUS RAW', repr(status.stdout.decode('utf8')))
    print('STATUS TOKENS', status.stdout.decode('utf8').split('\0'))
    diff = subprocess.run(['git', 'diff', '--name-status', '-z', 'HEAD', '--', '.'], cwd=d, check=True, capture_output=True)
    print('DIFF RAW', repr(diff.stdout.decode('utf8')))
    print('DIFF TOKENS', diff.stdout.decode('utf8').split('\0'))
    print('---')
