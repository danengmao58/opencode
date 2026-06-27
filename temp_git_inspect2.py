import os
import tempfile
import subprocess

d = tempfile.mkdtemp(prefix='gitdemo-')
print('DIR', d)
open(os.path.join(d, 'old.txt'), 'w', encoding='utf8').write('hello\n')
subprocess.run(['git', 'init', '-q'], cwd=d, check=True)
subprocess.run(['git', 'add', 'old.txt'], cwd=d, check=True)
subprocess.run(['git', 'commit', '-q', '--allow-empty-message', '-m', ''], cwd=d, check=True)
subprocess.run(['git', 'mv', 'old.txt', 'new.txt'], cwd=d, check=True)
status = subprocess.run(['git', 'status', '--porcelain=v1', '-z'], cwd=d, check=True, capture_output=True)
print('STATUS RAW:', repr(status.stdout.decode('utf8')))
print('STATUS TOKENS:', status.stdout.decode('utf8').split('\0'))
diff = subprocess.run(['git', 'diff', '--name-status', '-z', 'HEAD', '--', '.'], cwd=d, check=True, capture_output=True)
print('DIFF RAW:', repr(diff.stdout.decode('utf8')))
print('DIFF TOKENS:', diff.stdout.decode('utf8').split('\0'))

# now modify an existing file and check diff output for changed file
open(os.path.join(d, 'new.txt'), 'a', encoding='utf8').write('more\n')
diff2 = subprocess.run(['git', 'diff', '--name-status', '-z', 'HEAD', '--', '.'], cwd=d, check=True, capture_output=True)
print('DIFF2 RAW:', repr(diff2.stdout.decode('utf8')))
print('DIFF2 TOKENS:', diff2.stdout.decode('utf8').split('\0'))

# now untracked file
open(os.path.join(d, 'untracked.txt'), 'w', encoding='utf8').write('hi\n')
diff3 = subprocess.run(['git', 'status', '--porcelain=v1', '-z'], cwd=d, check=True, capture_output=True)
print('STATUS3 RAW:', repr(diff3.stdout.decode('utf8')))
print('STATUS3 TOKENS:', diff3.stdout.decode('utf8').split('\0'))
