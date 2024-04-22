import DOMPurify from "dompurify";

export const parseWordMeaningFromChitanka = (html: string): string | undefined => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const meaningElement = doc.querySelector('#content');


    if (meaningElement) {
        return DOMPurify.sanitize(meaningElement.innerHTML, {
            FORBID_TAGS: ['a', 'h1', 'h2', 'table']
        });
    }
}


