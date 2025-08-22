# 🎬 Video to MP3 Converter

A web application that converts video files to MP3 format using FFmpeg.





Demo: <br />

https://github.com/user-attachments/assets/188ecc1f-fe1c-414b-9ccb-588d2a507556




## ✨ Features

- Upload video files (MP4, AVI, MOV, MKV, WebM, FLV, etc.)
- Convert videos to MP3 format only
- Real-time progress tracking with visual feedback
- Download converted MP3 files
- File size validation (max 500MB, configurable)
- Modern, responsive UI with drag & drop support

## 🛠️ Tools & Technologies Used

### Backend
- **Bun Runtime** - Fast JavaScript runtime for server-side operations
- **FFmpeg** - Powerful multimedia framework for video/audio conversion
- **Bash Scripting** - Shell scripts for FFmpeg command execution
- **Node.js APIs** - File system operations and process management

### Frontend
- **React** - Modern UI framework with hooks
- **TailwindCSS** - A utility-first CSS framework
- **TypeScript** - Type-safe JavaScript development

### Development Tools
- **Bun Package Manager** - Fast dependency management
- **TypeScript Compiler** - Static type checking

## 🚀 Current Capabilities

**Note**: This application currently only supports MP3 output format. The `convert.sh` script is configured to:
- Extract audio from video files using FFmpeg
- Convert to MP3 using the `libmp3lame` codec with quality `-q:a 4`
- Remove video stream (`-vn` flag)
- Handle large files up to 500MB (configurable)
- Generate unique filenames with timestamps
- Automatic cleanup of temporary files

## 📋 Prerequisites

- [Bun](https://bun.sh/) runtime
- [FFmpeg](https://ffmpeg.org/) installed on your system
- Bash shell (for running the conversion script)

## 🔧 Installation

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

## 💻 Usage

1. Start the development server:
```bash
bun run dev
```

2. Open your browser and navigate to `http://localhost:3000`

3. Select a video file and click "Convert to MP3"

4. Wait for the conversion to complete

5. Download your converted MP3 file

## 🔄 How it Works

1. **File Upload**: The frontend accepts video files through a file input or drag & drop
2. **Validation**: Files are validated for type (video) and size (max 500MB, configurable)
3. **Upload**: Video files are uploaded to the server and stored in the `uploads/` directory
4. **Conversion**: The server uses the `convert.sh` script with FFmpeg to convert the video to MP3
5. **Download**: Converted MP3 files are stored in the `downloads/` directory and can be downloaded

## 🌐 API Endpoints

- `POST /api/convert` - Upload and convert a video file to MP3
- `GET /api/download/:filename` - Download a converted MP3 file

## 📁 File Structure

```
video-to-sound/
├── src/
│   ├── VideoConverter.tsx    # Main conversion component with drag & drop
│   ├── App.tsx              # Main app component and routing
│   ├── index.tsx            # Server entry point with API endpoints
│   ├── index.css            # Modern responsive styles
│   ├── index.html           # HTML template
│   ├── logo.svg             # Application logo
│   └── react.svg            # React logo
├── uploads/                 # Temporary video files storage
├── downloads/               # Converted MP3 files storage
├── convert.sh              # FFmpeg conversion script (MP3 only)
├── temp_convert_*.sh       # Temporary conversion scripts (auto-generated)
├── package.json            # Dependencies and scripts
├── bun.lock               # Bun lock file
├── tsconfig.json          # TypeScript configuration
├── build.ts               # Build configuration
└── README.md              # Project documentation
```

## 🔧 Conversion Script Details

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

## 🎯 Project Abilities & Features

### Core Functionality
- **Video Processing**: Handles multiple video formats
- **Audio Extraction**: Converts video audio tracks to high-quality MP3
- **Batch Processing**: Can handle multiple files sequentially
- **Error Handling**: Comprehensive error handling with user-friendly messages

### User Experience
- **Modern Interface**: Drag & drop file upload with progress tracking
- **File Validation**: Automatic file type and size validation
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Modern React**: Uses React 18 with hooks and modern patterns
- **Server-Side Processing**: FFmpeg runs on the server for better performance
- **File Management**: Automatic cleanup and organized file storage
- **API Design**: RESTful API with proper error handling and status codes

### Performance & Scalability
- **Fast Runtime**: Bun provides excellent performance for Node.js operations
- **Efficient Conversion**: FFmpeg optimized for audio extraction
- **Memory Management**: Proper file handling and cleanup
- **Configurable Limits**: Adjustable file size limits and quality settings

## 🚀 Development

- `bun run dev` - Start development server with HMR
- `bun run start` - Start production server
- `bun run build` - Build for production

## 🔍 Troubleshooting

1. **FFmpeg not found**: Make sure FFmpeg is installed and accessible in your PATH
2. **Permission denied**: Ensure the `convert.sh` script is executable: `chmod +x convert.sh`
3. **Large file uploads**: The application limits file size to 500MB for performance
4. **Conversion fails**: Check the server logs for FFmpeg error messages
5. **Format not supported**: Currently only MP3 output is supported

## 🔮 Future Enhancements

To support additional audio formats, the `convert.sh` script would need to be modified to:
- Accept format parameters
- Use different audio codecs (e.g., `libvorbis` for OGG, `aac` for M4A)
- Adjust quality settings for different formats
- Add support for different audio quality presets
- Implement batch processing for multiple files
- Add audio format detection and automatic codec selection

## 📄 License

MIT License
