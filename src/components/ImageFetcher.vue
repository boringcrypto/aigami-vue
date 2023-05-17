<template>
    <template ref="imagePromptTemplate">
        <pre>
            Start with "{{location_description}}" and then visually describe in 20 words what it looks like.
            Add a list of comma separated relevant keywords without a title prefix or starting a new paragraph.
            In this list you can add details of the location and the things that are there. 
            Imagine this is a painting and add details about the composition, camera angle and lighting to the keyword list.
            No more than 50 words in total.
        </pre>
    </template>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { get_response } from '@/utils/chatgpt';
import { nextTick } from 'vue';
import { ref } from 'vue';

const store = useAppStore();
const imagePromptTemplate = ref(null)
const location_description = ref("")
let busy = false

async function get_image(prompt: string) {
    const response = await fetch("https://app.brain.pet/pixelpet/v1/generate", {
        method: "POST",
        body: JSON.stringify({
            "model_id": 151,
            "prompt": prompt + ", " + store.artStyle + ", trending on cg society, trending on art station, digital masterpiece, intricate details, high quality, beautiful digital art, matte painting, concept art",
            "negative_prompt": "",
            "batch_size": 1,
            "steps": 30,
            "width": 680,
            "height": 512,
            "controlnet_units": [],
            "seed": 42,
            "cfg_scale": 7,
            "sampler": "Euler a",
            "tiling": false,
            "init_images": [],
            "denoising_strength": 1,
            "mask": null,
            "mask_blur": 0,
            "image_cfg_scale": 0,
            "inpaint_full_res": false,
            "inpainting_fill": 2
        }),
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + store.keys.brainpet
        }
    })
    const job_id = await response.text()

    const images = await (await fetch("https://app.brain.pet/pixelpet/v1/getJob?jobId=" + job_id, {
            headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + store.keys.brainpet
        }
    })).json()

    return images.images[0]
}

const loop = async () => {
    if (busy || !store.keys.brainpet) {
        return
    }
    busy = true

    for (const location of store.locations) {
        if (!location.imagePrompt) {
            console.log("Generating image prompt for", location.name)
            location_description.value = location.description
            await nextTick()
            if (!imagePromptTemplate.value) {
                continue
            }

            const prompt = (imagePromptTemplate.value as HTMLTemplateElement).innerText
            const imagePrompt = ref("")
            await get_response(prompt, imagePrompt)
            location.imagePrompt = imagePrompt.value
        }

        if (!location.image) {
            console.log("Generating image prompt for", location.name)
            console.log(location.imagePrompt)
            location.image = await get_image(location.imagePrompt)
        }
    }


    busy = false
}

const interval = setInterval(loop, 1000)
</script>