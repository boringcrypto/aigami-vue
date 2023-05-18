// @ts-ignore
import { createParser } from 'really-relaxed-json'

const parser = createParser()

export const parse = (json: string): any => {
    console.log("Loaded", json, "Parsed", parser.stringToJson(json))
    return JSON.parse(parser.stringToJson(json))
}

export const stringify = (obj: any): string => {
    return JSON.stringify(obj, null, 4)
}

export default {
    parse,
    stringify
}