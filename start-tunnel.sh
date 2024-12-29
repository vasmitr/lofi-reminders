#!/bin/bash

# Step 1: Build the project
echo "Building the project..."
npm run build
if [ $? -ne 0 ]; then
  echo "Build failed. Exiting."
  exit 1
fi

# Step 2: Start the preview server
echo "Starting the preview server..."
npm run preview > preview.log 2>&1 &
PREVIEW_PID=$!

# Give the preview server some time to start
sleep 5

# Step 3: Run cloudflared tunnel in the background
echo "Starting the Cloudflare tunnel..."
cloudflared tunnel --url http://localhost:4173 > tunnel.log 2>&1 &
CLOUDFLARED_PID=$!

# Wait for the tunnel to initialize
sleep 10

# Step 4: Extract the public URL, filtering unwanted text
URL=$(grep -Eo "https://[a-zA-Z0-9.-]+\.trycloudflare\.com" tunnel.log | head -n 1)

# Display the URL and generate a QR code
echo "Tunnel URL: $URL"

if [ -z "$URL" ]; then
  echo "Failed to extract the tunnel URL. Check tunnel.log for details."
  # Kill the background processes if the tunnel setup fails
  kill $PREVIEW_PID $CLOUDFLARED_PID
  exit 1
fi

echo "$URL" | qrencode -t ansiutf8

# Step 5: Keep the script running to maintain the processes
echo "Press Ctrl+C to stop the tunnel and preview server."

# Wait for the background processes to exit
wait $PREVIEW_PID $CLOUDFLARED_PID