# Video to MP3 Converter

A web application that converts video files to MP3 format using FFmpeg.

## Features

- Upload video files (MP4, AVI, MOV, MKV, etc.)
- Convert videos to MP3 format only
- Real-time progress tracking
- Download converted MP3 files
- File size validation (max 500MB)
- Modern, responsive UI

## Current Capabilities

**Note**: This application currently only supports MP3 output format. The `convert.sh` script is configured to:
- Extract audio from video files
- Convert to MP3 using the `libmp3lame` codec
- Set quality to `-q:a 4` (good quality, reasonable file size)
- Remove video stream (`-vn` flag)

## Prerequisites

- [Bun](https://bun.sh/) runtime
- [FFmpeg](https://ffmpeg.org/) installed on your system
- Bash shell (for running the conversion script)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd video-to-sound
```

2. Install dependencies:
```bash
bun install
```

3. Make sure FFmpeg is installed:
```bash
# On Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# On macOS
brew install ffmpeg

# On Windows
# Download from https://ffmpeg.org/download.html
```

## Usage

1. Start the development server:
```bash
bun run dev
```

2. Open your browser and navigate to `http://localhost:3000`

3. Select a video file and click "Convert to MP3"

4. Wait for the conversion to complete

5. Download your converted MP3 file

## How it Works

1. **File Upload**: The frontend accepts video files through a file input
2. **Validation**: Files are validated for type (video) and size (max 500MB), but it changable.
3. **Upload**: Video files are uploaded to the server and stored in the `uploads/` directory
4. **Conversion**: The server uses the `convert.sh` script with FFmpeg to convert the video to MP3
5. **Download**: Converted MP3 files are stored in the `downloads/` directory and can be downloaded

## API Endpoints

- `POST /api/convert` - Upload and convert a video file to MP3
- `GET /api/download/:filename` - Download a converted MP3 file

## File Structure

```
video-to-sound/
├── src/
│   ├── VideoConverter.tsx    # Main conversion component
│   ├── App.tsx              # App component
│   ├── index.tsx            # Server entry point
│   └── index.css            # Styles
├── uploads/                 # Temporary video files
├── downloads/               # Converted MP3 files
├── convert.sh              # FFmpeg conversion script (MP3 only)
└── package.json
```

## Conversion Script Details

The `convert.sh` script uses FFmpeg with the following settings:
- **Input**: Any video format supported by FFmpeg
- **Output**: MP3 format only
- **Audio codec**: `libmp3lame`
- **Quality**: `-q:a 4` (good quality, reasonable file size)
- **Video removal**: `-vn` (extract audio only)

### Example FFmpeg command:
```bash
ffmpeg -i "input_video.mp4" \
       -vn -acodec libmp3lame -q:a 4 \
       "output_audio.mp3"
```

## Development

- `bun run dev` - Start development server with HMR
- `bun run start` - Start production server
- `bun run build` - Build for production

## Troubleshooting

1. **FFmpeg not found**: Make sure FFmpeg is installed and accessible in your PATH
2. **Permission denied**: Ensure the `convert.sh` script is executable: `chmod +x convert.sh`
3. **Large file uploads**: The application limits file size to 500MB for performance
4. **Conversion fails**: Check the server logs for FFmpeg error messages
5. **Format not supported**: Currently only MP3 output is supported

## Future Enhancements

To support additional audio formats, the `convert.sh` script would need to be modified to:
- Accept format parameters
- Use different audio codecs (e.g., `libvorbis` for OGG, `aac` for M4A)
- Adjust quality settings for different formats

## License

MIT License
