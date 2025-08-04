# convert to MP3
ffmpeg -i {src} \
        -vn -acodec libmp3lame -q:a 4 \
        {dest}
