# Open Image Kit

**Open Image Kit** is a free, privacy-focused web application for image manipulation. It runs entirely in your browser—no data ever leaves your device.

Created by **[guidrezza](https://github.com/guidrezza)**.

![Open Image Kit Preview](https://via.placeholder.com/800x400?text=Open+Image+Kit+Preview)

## Features

- **Convert**: Batch convert images to PNG, JPG, or WebP.
- **Resize**: Smart resizing by width, height, or percentage with aspect ratio locking.
- **Compress**: Reduce file size efficiently with adjustable quality.
- **Upscale**: Increase image resolution using bicubic smoothing (2x, 4x).
- **Privacy First**: All processing happens client-side using HTML5 Canvas and JavaScript.
- **Modern Design**: Built with a premium Glassmorphism / iOS 26 inspired aesthetic.

## Tech Stack

- **Core**: Vanilla HTML5, CSS3, JavaScript (ES6+).
- **Architecture**: Modular Strategy Pattern for image operations.
- **No Backend**: Zero server dependencies.

## How to Run Locally

Since this is a static web application, you can host it easily on your local machine.

### Option 1: Using npx (Recommended)
If you have Node.js installed, you can start a local server instantly:

```bash
# Navigate to the project directory
cd open-image-kit

# Start a local server
npx http-server .
```

Then open `http://localhost:8080` in your browser.

### Option 2: VS Code Live Server
1. Open the project in **VS Code**.
2. Install the **Live Server** extension.
3. Right-click `index.html` and select **"Open with Live Server"**.

### Option 3: Direct File Open
You can simply double-click `index.html` to open it in your browser.
*Note: Some strict browser security settings might block certain canvas operations when running from `file://` protocol. A local server is recommended.*

## License

This project is open source. Feel free to contribute or fork.
