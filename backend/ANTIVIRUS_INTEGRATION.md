# Antivirus Integration Documentation

## Overview

This document describes the antivirus scanning integration using the VirusTotal API. Every time a file is uploaded through the `createResource` mutation, it will be automatically scanned for malware and other threats.

## Features

- **Automatic Scanning**: Files are scanned automatically when uploaded
- **Asynchronous Processing**: Scanning happens in the background without blocking file uploads
- **Status Tracking**: Real-time scan status tracking with multiple states
- **Threat Detection**: Detailed threat information when malicious files are detected
- **Comprehensive Logging**: All scan activities are logged for audit purposes

## Scan Status States

- `PENDING`: File uploaded but scan not yet started
- `SCANNING`: File is currently being scanned by VirusTotal
- `CLEAN`: File scanned and found to be safe
- `INFECTED`: File contains malware or other threats
- `ERROR`: An error occurred during the scanning process

## Database Schema Changes

The `Resource` entity has been extended with the following fields:

```typescript
scanStatus: ScanStatus;        // Current scan status
scanAnalysisId: string;        // VirusTotal analysis ID
scanDate: Date;                // When the scan was performed
threatCount: number;           // Number of threats detected
scanError: string;             // Error message if scan failed
```

## API Endpoints

### New Query: `getResourceScanStatus`

Check the current scan status of a resource:

```graphql
query GetResourceScanStatus($resourceId: ID!) {
  getResourceScanStatus(resourceId: $resourceId) {
    id
    name
    scanStatus
    scanAnalysisId
    scanDate
    threatCount
    scanError
  }
}
```

### Modified Mutation: `createResource`

The `createResource` mutation now automatically triggers antivirus scanning:

```graphql
mutation CreateResource($data: ResourceInput!) {
  createResource(data: $data) {
    id
    name
    scanStatus
    # ... other fields
  }
}
```

## Environment Configuration

Add the following environment variable to your `.env` file:

```env
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
```

To obtain a VirusTotal API key:
1. Sign up for a VirusTotal Community account
2. Go to your profile settings
3. Generate an API key

## Usage Example

```typescript
// When creating a resource, scanning happens automatically
const resource = await createResource({
  userId: 1,
  name: "document.pdf",
  description: "Important document",
  url: "https://example.com/files/document.pdf",
  path: "/uploads/document.pdf",
  size: 1024000
});

// Check scan status
const scanStatus = await getResourceScanStatus(resource.id);
console.log(`Scan status: ${scanStatus.scanStatus}`);

if (scanStatus.scanStatus === 'INFECTED') {
  console.log(`Threats detected: ${scanStatus.threatCount}`);
}
```

## Error Handling

The system handles various error scenarios:

- **API Key Missing**: Returns error status if VirusTotal API key is not configured
- **File Not Found**: Returns error status if the file to scan doesn't exist
- **API Errors**: Handles VirusTotal API errors gracefully
- **Network Issues**: Retries and logs network-related errors

## Logging

All antivirus activities are logged in the system logs:

- Scan initiation
- Scan completion (clean files)
- Threat detection (infected files)
- Error conditions

## Rate Limits

VirusTotal has rate limits:
- **Free tier**: 4 requests per minute
- **Paid tiers**: Higher limits available

Consider implementing rate limiting in production environments.

## Security Considerations

1. **File Privacy**: Files uploaded to VirusTotal are shared with the security community
2. **API Key Security**: Store the VirusTotal API key securely
3. **Error Information**: Be careful not to expose sensitive information in error messages
4. **File Size Limits**: VirusTotal has a 32MB file size limit for direct uploads

## Monitoring

Monitor the following metrics:
- Scan success rate
- Average scan duration
- Number of infected files detected
- API rate limit usage

## Troubleshooting

### Common Issues

1. **"VirusTotal API key not configured"**
   - Ensure `VIRUSTOTAL_API_KEY` is set in your environment variables

2. **"File not found" errors**
   - Verify the file path is correct and the file exists

3. **Rate limit exceeded**
   - Implement delays between requests or upgrade your VirusTotal plan

4. **Scan stuck in SCANNING status**
   - Large files may take longer to scan
   - Check VirusTotal service status
   - Verify your API key has sufficient permissions

### Debug Mode

Enable debug logging by checking the system logs for detailed scan information.
