@echo off

if not exist "%2" mkdir "%2"
python image_fix.py %1 %2 && python tiler.py %2
