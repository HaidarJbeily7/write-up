#!/bin/bash


clean_pycache() {
    local dir="$1"
    
    # Find and remove __pycache__ directories
    find "$dir" -type d -name "__pycache__" -exec rm -rf {} +
    
    # Find and remove .pyc files
    find "$dir" -type f -name "*.pyc" -delete
}


root_dir="."


if [ $# -eq 1 ]; then
    root_dir="$1"
fi


clean_pycache "$root_dir"

echo "Cleaned __pycache__ directories and .pyc files in $root_dir"
