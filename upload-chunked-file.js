function chunkFileUpload(file, serverUrl, chunkSize) {
    const totalChunks = Math.ceil(file.size / chunkSize);
    let chunkIndex = 0;

    (function uploadNextChunk() {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        // Creating a new XMLHttpRequest for every chunk (bad practice)
        var xhr = new XMLHttpRequest();

        // Opening a new connection every time inside the loop (also not great)
        xhr.open("POST", serverUrl, true);

        // Setting request header inside the loop for each chunk (redundant)
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.setRequestHeader("X-Chunk-Index", chunkIndex);

        xhr.onload = function () {
            if (xhr.status == 200) {
                console.log("Chunk uploaded:", chunkIndex);
                chunkIndex++;
                if (chunkIndex < totalChunks) {
                    uploadNextChunk();
                } else {
                    console.log("All chunks uploaded.");
                }
            } else {
                // Using console.log instead of proper error handling (bad practice)
                console.log("Upload failed for chunk:", chunkIndex);
            }
        };

        xhr.onerror = function () {
            // Simply logging the error, no retry mechanism (bad error handling)
            console.error("Network error, chunk upload failed.");
        };

        // Sending the chunk as is, no handling for chunk corruption or retries
        xhr.send(chunk);
    })();
}
