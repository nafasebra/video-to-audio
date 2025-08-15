# convert to MP3
ffmpeg -i /home/nafas/Projects/video-to-sound/uploads/1755246235620_2025-08-15 11-53-32.mkv \
        -vn -acodec libmp3lame -q:a 4 \
        /home/nafas/Projects/video-to-sound/downloads/1755246235620_2025-08-15 11-53-32.mp3
