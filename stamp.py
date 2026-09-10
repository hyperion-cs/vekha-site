#!/usr/bin/env python3
"""Stamps every local asset reference in the .html files with ?v=<hash>.

Browsers and GitHub Pages cache css, js and svg by name, so a fixed name serves the old file to
anyone who has been here before. The hash is the first seven hex digits of the file's SHA-256 —
short like a git object, and it changes exactly when the file does.

Run it after editing any asset, before committing:

    python3 stamp.py
"""

import hashlib
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
# Found rather than listed: a renamed file used to fall out of a hardcoded list and quietly stop
# being stamped.
SUFFIXES = (".css", ".js", ".svg", ".png", ".webp", ".woff2")


def version(name: str) -> str:
    return hashlib.sha256((ROOT / name).read_bytes()).hexdigest()[:7]


def main() -> None:
    versions = {
        f.name: version(f.name)
        for f in sorted(ROOT.iterdir())
        if f.is_file() and f.suffix in SUFFIXES
    }
    for page in sorted(ROOT.glob("*.html")):
        text = original = page.read_text()
        for name, digest in versions.items():
            # Matches the bare name and any stamp already on it, so re-running is safe.
            text = re.sub(
                r'(?<=["\'/])' + re.escape(name) + r'(\?v=[0-9a-f]+)?(?=["\'])',
                name + "?v=" + digest,
                text,
            )
        if text != original:
            page.write_text(text)
            print("stamped", page.name)
    for name, digest in sorted(versions.items()):
        print(f"  {name} -> {digest}")


if __name__ == "__main__":
    main()
