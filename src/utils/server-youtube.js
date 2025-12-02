"use server";

import { ApifyClient } from 'apify-client';
export async function downloadYouTubeAudio(videoId) {

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
});

// Prepare Actor input
const input = {
    "video_urls": [
        {
            "url": "https://youtu.be/kBYUL26zAYU?si=BYwFXleVs-HCEtvO"
        },
    ],
    "desired_resolution": "1080p",
    "use_key_value_store": true,
    "show_additional_metadata": true
};

    // Run the Actor and wait for it to finish
    const run = await client.actor("xgXvf2RWYmPm769kB").call(input);

    // Fetch and print Actor results from the run's dataset (if any)
    console.log('Results from dataset');
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    items.forEach((item) => {
        console.log(item);
    });
    console.log("itemssssssssssss", items)

    return items
}
