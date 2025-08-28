# Storage API

A Node.js/Express API for handling file uploads and temporary file sharing.

## Features

- **File Upload**: Secure file upload with authentication
- **Temporary File Sharing**: Generate temporary links that expire after 24 hours
- **Automatic Cleanup**: Expired files are automatically removed from storage every 5 minutes
- **File Management**: Track file metadata, access counts, and expiration times

## API Endpoints

### Temporary Files (Public)

- `POST /temp/upload` - Upload a file to generate a temporary link
- `GET /temp/:tempId` - Download a file using a temporary link
- `GET /temp/:tempId/info` - Get information about a temporary file
- `POST /temp/cleanup` - Manually trigger cleanup of expired files (for testing)

### Secure Files (Authenticated)

- `POST /upload` - Upload a file to secure storage
- `GET /files` - List uploaded files
- `GET /uploads/:filename` - Download a file

## File Expiration & Cleanup

### Automatic Cleanup
- **Frequency**: Every 5 minute
- **Scope**: All expired temporary files
- **Actions**: 
  - Removes expired files from disk storage
  - Updates `temp-links.json` to remove expired entries
  - Logs cleanup operations

### Manual Cleanup
- **Endpoint**: `POST /temp/cleanup`
- **Use Case**: Testing, debugging, or immediate cleanup
- **Response**: JSON confirmation of cleanup completion

### Expiration Behavior
- **Default TTL**: 24 hours from upload
- **Storage**: Files are stored in `uploads/temp/` directory
- **Metadata**: Tracked in `temp-links.json` with timestamps

## File Storage Structure

```
storage-api/
├── uploads/           # Secure file storage
├── uploads/temp/      # Temporary file storage
├── temp-links.json    # Temporary file metadata
└── src/
    ├── services/
    │   └── cleanupService.ts  # Automatic cleanup service
    ├── controllers/
    │   └── tempFileController.ts  # Temporary file handling
    └── routes/
        └── tempFileRoutes.ts   # API routes
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Running the Server
```bash
npm start
```

The server will start on port 3000 with automatic cleanup service enabled.



## Configuration

### Cleanup Intervals
- **Default**: 5 minute
- **Customizable**: Modify `CLEANUP_INTERVAL` in `cleanupService.ts`

### File Expiration
- **Default TTL**: 24 hours
- **Customizable**: Modify expiration calculation in `tempFileController.ts`

## Monitoring

The cleanup service logs all operations:
- Startup messages
- Periodic cleanup results
- File removal confirmations
- Error handling

Check console output for cleanup service activity. 