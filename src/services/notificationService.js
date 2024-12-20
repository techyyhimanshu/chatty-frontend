export const playNotificationSound = async () => {
    try {
        // Create an audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Fetch the audio file
        const response = await fetch("audio/notification.mp3");
        const audioData = await response.arrayBuffer();

        // Decode the audio data
        const audioBuffer = await audioContext.decodeAudioData(audioData);

        // Create a buffer source
        const bufferSource = audioContext.createBufferSource();
        bufferSource.buffer = audioBuffer;

        // Connect the source to the audio context's destination (speakers)
        bufferSource.connect(audioContext.destination);

        // Start playback
        bufferSource.start();
    } catch (error) {
        console.error("Failed to play notification sound:", error);
    }
};
