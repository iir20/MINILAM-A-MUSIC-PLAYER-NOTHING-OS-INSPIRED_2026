# Security Policy

## Reporting a Vulnerability
We take the security of MiniLam OS seriously. If you discover a security vulnerability, please do not open a public issue. Instead, please report it privately.

## Supported Versions
At this time, only the latest version of MiniLam OS is supported for security updates.

## Precautions
- **Local Files**: This application processes audio files locally in your browser. Metadata is stored in a local IndexedDB (Dexie).
- **Blob URLs**: Audio files are managed via temporary Blob URLs which are revoked periodically to manage memory.
- **Third-Party Content**: The application may fetch album art from Unsplash if metadata does not contain a cover image.
