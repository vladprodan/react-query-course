export default async function fetchWithError(url, options) {
    const response = await fetch(url, options);

    let errorMessage = '';
    if (response.status !== 200) {
        errorMessage += `Request failed with status ${response.status}. `;
    }
    const body = await response.json();
    if (body.error) {
        errorMessage += body.error;
    }

    if (errorMessage) {
        throw new Error(errorMessage);
    }

    return body;
}
