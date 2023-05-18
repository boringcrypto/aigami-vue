export function fillTemplate(template: string, piniaStore: any, args: { [key:string] : string } = {}): string {
    // Regular expression to match the template syntax
    const regex = /\{\{\s*(.*?)\s*\}\}/g;

    return template.replace(regex, (_, g1) => {
        const parts = g1.split('||').map((s: string) => s.trim());
        let value = null;
        
        for (let part of parts) {
            if (part.startsWith('store.')) {
                value = getNestedValue(piniaStore, part.slice(6));
            } else if (args.hasOwnProperty(part)) {
                value = args[part];
            } else if (part.startsWith('"') && part.endsWith('"')) { // Check for string literal
                value = part.slice(1, -1);
            }

            if (value) {
                break;
            }
        }
        
        return value || '';
    });
}

// Helper function to get nested properties from an object
function getNestedValue(obj: any, path: string): string | null {
    const parts = path.split('.');
    let value = obj;

    for (let part of parts) {
        if (value === null || typeof value !== 'object') {
            return null;
        }
        value = value[part];
    }

    return value;
}
