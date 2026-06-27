import os
import tempfile
import subprocess
import pathlib

dirpath = tempfile.mkdtemp(prefix="gitdemo-")
print("DIR", dirpath)
open(os.path.join(dirpath, "old.txt"), "w", encoding="utf8").write("hello\n")
subprocess.run(["git", "init", "-q"], cwd=dirpath, check=True)
subprocess.run(["git", "add", "old.txt"], cwd=dirpath, check=True)
subprocess.run(["git", "commit", "-q", "--allow-empty-message", "-m", ""], cwd=dirpath, check=True)
subprocess.run(["git", "mv", "old.txt", "new.txt"], cwd=dirpath, check=True)
status = subprocess.run(["git", "status", "--porcelain=v1", "-z"], cwd=dirpath, check=True, capture_output=True)
print("STATUS RAW", repr(status.stdout.decode('utf8')))
print("STATUS TOKENS", status.stdout.decode('utf8').split('\0'))
diff = subprocess.run(["git", "diff", "--name-status", "-z", "HEAD", "--", "."], cwd=dirpath, check=True, capture_output=True)
print("DIFF RAW", repr(diff.stdout.decode('utf8')))
print("DIFF TOKENS", diff.stdout.decode('utf8').split('\0'))
