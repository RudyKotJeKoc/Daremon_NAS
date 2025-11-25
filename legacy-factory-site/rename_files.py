#!/usr/bin/env python3
"""
Script to rename files with numbers at the end to format: name (number).ext
Example: video1.mp4 -> video (1).mp4
"""

import os
import re
import sys
from pathlib import Path


def rename_files_with_numbers(directory, max_files=None, dry_run=True):
    """
    Rename files that end with numbers to include spaces and parentheses.

    Args:
        directory: Directory to process
        max_files: Maximum number of files to process (optional)
        dry_run: If True, only print what would be done
    """
    # Pattern to match files ending with numbers before extension
    pattern = re.compile(r'^(.+?)(\d+)(\.[^.]+)$')

    renamed_count = 0
    files_processed = []

    # Get all files in directory
    try:
        files = sorted(Path(directory).iterdir())
    except FileNotFoundError:
        print(f"Directory not found: {directory}")
        return renamed_count

    for filepath in files:
        if not filepath.is_file():
            continue

        filename = filepath.name
        match = pattern.match(filename)

        if match:
            base_name = match.group(1)
            number = match.group(2)
            extension = match.group(3)

            # Create new filename with space and parentheses
            new_filename = f"{base_name} ({number}){extension}"
            new_filepath = filepath.parent / new_filename

            # Check if target already exists
            if new_filepath.exists():
                print(f"⚠️  Target already exists: {new_filename}")
                continue

            files_processed.append({
                'old': str(filepath),
                'new': str(new_filepath),
                'old_name': filename,
                'new_name': new_filename
            })

            if dry_run:
                print(f"Would rename: {filename} → {new_filename}")
            else:
                try:
                    filepath.rename(new_filepath)
                    print(f"✓ Renamed: {filename} → {new_filename}")
                    renamed_count += 1
                except Exception as e:
                    print(f"✗ Error renaming {filename}: {e}")

            # Check max_files limit
            if max_files and len(files_processed) >= max_files:
                print(f"\nReached maximum of {max_files} files")
                break

    return renamed_count, files_processed


def main():
    directories = {
        './music': 200,
        './images': 61,
        './video': 50
    }

    print("File Renaming Script")
    print("=" * 60)
    print("\nDry run - showing what would be renamed:\n")

    all_files = []
    for directory, max_files in directories.items():
        if os.path.exists(directory):
            print(f"\n📁 Processing: {directory} (max: {max_files})")
            print("-" * 60)
            count, files = rename_files_with_numbers(directory, max_files, dry_run=True)
            all_files.extend(files)

    if not all_files:
        print("\n✓ No files found that need renaming.")
        return

    print("\n" + "=" * 60)
    print(f"\nTotal files to rename: {len(all_files)}")
    print("\nProceed with renaming? (y/n): ", end='')

    # For automated execution, accept 'y' as argument
    if len(sys.argv) > 1 and sys.argv[1] == '-y':
        response = 'y'
        print('y')
    else:
        response = input().strip().lower()

    if response == 'y':
        print("\nExecuting renames...\n")
        total_renamed = 0
        for directory, max_files in directories.items():
            if os.path.exists(directory):
                print(f"\n📁 Processing: {directory}")
                print("-" * 60)
                count, _ = rename_files_with_numbers(directory, max_files, dry_run=False)
                total_renamed += count

        print("\n" + "=" * 60)
        print(f"✓ Successfully renamed {total_renamed} files")
    else:
        print("\nRenaming cancelled.")


if __name__ == "__main__":
    main()
